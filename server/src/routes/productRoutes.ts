import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController";
import { verifyToken, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

// Admin-only routes
router.post("/", verifyToken, authorizeRoles("admin"), createProduct);
router.put("/:id", verifyToken, authorizeRoles("admin"), updateProduct);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteProduct);

// Category management
router.post(
  "/categories",
  verifyToken,
  authorizeRoles("admin"),
  createCategory,
);
router.put(
  "/categories/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateCategory,
);
router.delete(
  "/categories/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteCategory,
);

export default router;
