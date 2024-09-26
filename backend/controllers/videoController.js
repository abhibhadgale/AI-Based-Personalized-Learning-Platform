import Video from '../models/Video.js';

// Controller to fetch a video by its videoId
export const getVideoById = async (req, res) => {
  const { videoId } = req.params;

  try {
    const video = await Video.findOne({ _id: videoId });

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Convert the regular YouTube link to the embeddable format
    const videoUrl = video.link.replace('watch?v=', 'embed/');

    res.status(200).json({ ...video.toObject(), embedLink: videoUrl });
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
