import express from 'express';
import authMiddleware from '../middleware/auth.js';
import prisma from '../prismaClient.js';

const router = express.Router();

// @route   GET /api/items
// @desc    Get all items
// @access  Public (or Private depending on your requirement, let's keep it public for the dashboard)
router.get('/', async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            phone: true,
            department: true,
            classDivision: true,
            graduationYear: true,
            email: true
          }
        }
      }
    });
    res.json(items);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/items
// @desc    Create an item
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, date, location, type, image } = req.body;

    // Simple image size validation (if base64)
    if (image && image.length > 5 * 1024 * 1024) {
      return res.status(400).json({ message: 'Image size exceeds 5MB limit.' });
    }

    const item = await prisma.item.create({
      data: {
        title,
        description,
        category,
        date: new Date(date),
        location,
        type,
        image: image || "", 
        userId: req.user.id
      }
    });
    
    // Update user's reported count
    await prisma.user.update({
      where: { id: req.user.id },
      data: { itemsReported: { increment: 1 } }
    });

    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/items/myitems
// @desc    Get logged in user's items
// @access  Private
router.get('/myitems', authMiddleware, async (req, res) => {
    try {
      const items = await prisma.item.findMany({
        where: { userId: req.user.id },
        orderBy: { date: 'desc' }
      });
      res.json(items);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route   PUT /api/items/:id/status
// @desc    Update item status (e.g., Active to Resolved)
// @access  Private
router.put('/:id/status', authMiddleware, async (req, res) => {
    try {
      let item = await prisma.item.findUnique({
        where: { id: req.params.id }
      });
      
      if (!item) return res.status(404).json({ message: 'Item not found' });
      
      // Ensure user owns the item
      if (item.userId !== req.user.id) {
          return res.status(401).json({ message: 'User not authorized' });
      }

      item = await prisma.item.update({
        where: { id: req.params.id },
        data: { status: req.body.status }
      });

      res.json(item);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/items/:id
// @desc    Delete item
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const item = await prisma.item.findUnique({
        where: { id: req.params.id }
      });
      
      if (!item) return res.status(404).json({ message: 'Item not found' });
      
      // Ensure user owns the item
      if (item.userId !== req.user.id) {
          return res.status(401).json({ message: 'User not authorized' });
      }

      await prisma.item.delete({
        where: { id: req.params.id }
      });

      // Update user's reported count
      await prisma.user.update({
        where: { id: req.user.id },
        data: { itemsReported: { increment: -1 } }
      });

      res.json({ message: 'Item removed' });
    } catch (err) {
      console.error(err.message);
      if (err.code === 'P2025') { // Prisma RecordNotFound
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(500).send('Server Error');
    }
});

export default router;
