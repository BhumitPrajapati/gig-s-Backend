const express = require("express");
const { addList, getAllLists, getUserByLists, deleteList, updateList } = require("../controllers/dashboard/listings");

const router = express.Router();

router.post("/addList", addList);
router.get("/getAllLists", getAllLists);
router.post("/getUserByLists", getUserByLists);
router.delete("/deleteList/:id", deleteList);
router.put("/updateList/:id", updateList);

module.exports = router;