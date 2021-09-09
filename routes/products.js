import express from "express";
import multer from "multer";
import Products from "../dbModel.js";

const router = express.Router();

router.use("/uploads", express.static("uploads"));
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Please only jpg and png files"), false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// get all
router.get("/", async (req, res) => {
  await Products.find((err, data) => {
    if (err) res.status(500).send(err);
    else res.status(200).send(data);
  });
});

// get one
router.get("/:id", getProduct, (req, res) => {
  // req.params.id
  res.json(res.product);
});

// creating
router.post("/", upload.single("productImage"), (req, res) => {
  const product = new Products({
    title: req.body.title,
    price: req.body.price,
    amountNeeded: req.body.amountNeeded,
    productImageLink: req.file.path,
  });
  product
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => console.log(err));
});

// updating
router.patch(
  "/:id",
  getProduct,
  upload.single("productImage"),
  async (req, res) => {
    const dataChange = req.body;
    // make an if statement for every info in the document;
    if (dataChange.title !== null) {
      res.product.title = dataChange.title;
    } else {
      res.product.title = res.product.title;
    }
    if (dataChange.price !== null) {
      res.product.price = dataChange.price;
    } else {
      res.product.price = res.product.price;
    }
    if (req.file) {
      res.product.productImageLink = req.file.path;
    }
    if (dataChange.amountNeeded !== null) {
      res.product.amountNeeded = dataChange.amountNeeded;
    } else {
      res.product.amountNeeded = res.product.amountNeeded;
    }
    if (dataChange.company !== null) {
      res.product.company = dataChange.company;
    } else {
      res.product.company = res.product.company;
    }
    if (dataChange.size !== null) {
      res.product.size = dataChange.size;
    } else {
      res.product.size = res.product.size;
    }
    if (dataChange.kind !== null) {
      res.product.kind = dataChange.kind;
    } else {
      res.product.kind = res.product.kind;
    }
    try {
      const updatedProduct = await res.product.save();
      res.json(updatedProduct);
    } catch (err) {
      res.status(400).send(err);
    }
  }
);

// deleting
router.delete("/:id", getProduct, async (req, res) => {
  try {
    await res.product.remove();
    res.send("deleted successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});

// creating my middelware
async function getProduct(req, res, next) {
  let product;
  try {
    product = await Products.findById(req.params.id);
    if (product === null) {
      return res.status(404).send("404 :)");
    }
  } catch (err) {
    res.status(500).send(err);
  }
  res.product = product;
  next();
}

export default router;
