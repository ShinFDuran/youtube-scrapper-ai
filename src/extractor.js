const ytdl = require('ytdl-core');
const yts = require('yt-search');
const { formatDuration } = require('./utils');

/**
 * Extract video information from a YouTube channel
 * @param {string} channelQuery - Channel name or URL
 * @param {number} maxVideos - Maximum number of videos to process
 * @returns {Promise<Array>} Array of video objects with metadata
 */
async function extractChannelInfo(channelQuery, maxVideos) {
    try {
        console.log(`🔍 Searching for channel: ${channelQuery}`);
        
        // Search for the channel
        const searchResults = await yts(channelQuery);
        
        if (!searchResults.videos || searchResults.videos.length === 0) {
            console.log('❌ No videos found for this channel');
            return [];
        }
        
        console.log(`📺 Found ${searchResults.videos.length} videos, processing first ${maxVideos}...`);
        
        const videos = [];
        const videosToProcess = searchResults.videos.slice(0, maxVideos);
        
        // Process each video with progress indicator
        for (let i = 0; i < videosToProcess.length; i++) {
            const video = videosToProcess[i];
            
            try {
                console.log(`⏳ Processing video ${i + 1}/${videosToProcess.length}: ${video.title}`);
                
                // Get detailed video information
                const info = await ytdl.getBasicInfo(video.url);
                
                videos.push({
                    title: info.videoDetails.title,
                    description: info.videoDetails.description || 'No description',
                    duration: formatDuration(info.videoDetails.lengthSeconds),
                    durationSeconds: parseInt(info.videoDetails.lengthSeconds),
                    views: parseInt(info.videoDetails.viewCount),
                    publishDate: info.videoDetails.publishDate,
                    url: video.url,
                    videoId: info.videoDetails.videoId,
                    thumbnail: info.videoDetails.thumbnails[0]?.url || '',
                    channelName: info.videoDetails.author.name,
                    channelUrl: info.videoDetails.author.channel_url,
                    keywords: info.videoDetails.keywords || [],
                    category: info.videoDetails.category || 'Unknown'
                });
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (videoError) {
                console.log(`⚠️  Error processing video: ${video.title} - ${videoError.message}`);
            }
        }
        
        return videos;
        
    } catch (error) {
        console.error('❌ Error extracting channel info:', error.message);
        return [];
    }
}

/**
 * Extract information from a single video
 * @param {string} videoUrl - URL of the video
 * @returns {Promise<Object|null>} Video object with metadata or null if error
 */
async function extractVideoInfo(videoUrl) {
    try {
        const info = await ytdl.getBasicInfo(videoUrl);
        
        return {
            title: info.videoDetails.title,
            description: info.videoDetails.description || 'No description',
            duration: formatDuration(info.videoDetails.lengthSeconds),
            durationSeconds: parseInt(info.videoDetails.lengthSeconds),
            views: parseInt(info.videoDetails.viewCount),
            publishDate: info.videoDetails.publishDate,
            url: videoUrl,
            videoId: info.videoDetails.videoId,
            thumbnail: info.videoDetails.thumbnails[0]?.url || '',
            channelName: info.videoDetails.author.name,
            channelUrl: info.videoDetails.author.channel_url,
            keywords: info.videoDetails.keywords || [],
            category: info.videoDetails.category || 'Unknown'
        };
        
    } catch (error) {
        console.error(`❌ Error extracting video info: ${error.message}`);
        return null;
    }
}

module.exports = {
    extractChannelInfo,
    extractVideoInfo
};