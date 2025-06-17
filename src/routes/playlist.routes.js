import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addVideoInPlaylist, createPlaylist, deletePlaylist, deleteVideoFromPlaylist, getPlaylistById, getUserPlaylists, updatePlaylist } from "../controllers/playlist.controller.js";

const router = Router()

router.route("/createplaylist").post(verifyJWT, createPlaylist)
router.post("/:playlistId/:videoId", verifyJWT, addVideoInPlaylist)
router.delete("/:playlistId/:videoId", verifyJWT, deleteVideoFromPlaylist)
router.delete("/:playlistId", verifyJWT, deletePlaylist)
router.patch("/:playlistId", verifyJWT, updatePlaylist)
router.get("/:playlistId", getPlaylistById)
router.get("/user/:userId", getUserPlaylists)


export default router;