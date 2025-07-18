const fs = require('fs');

/**
 * Format duration from seconds to HH:MM:SS format
 * @param {string|number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
function formatDuration(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

/**
 * Format numbers with commas for better readability
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toLocaleString();
}

/**
 * Save results to JSON file
 * @param {Array} videos - Array of video objects
 * @param {string} channelName - Channel name for filename
 */
function saveToFile(videos, channelName) {
    const filename = `${channelName.replace(/[^a-zA-Z0-9]/g, '_')}_videos.json`;
    
    try {
        fs.writeFileSync(filename, JSON.stringify(videos, null, 2));
        console.log(`💾 Results saved to: ${filename}`);
    } catch (error) {
        console.error('❌ Error saving file:', error.message);
    }
}

/**
 * Display video statistics
 * @param {Array} videos - Array of video objects
 */
function displayStats(videos) {
    if (videos.length === 0) return;
    
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
    const avgViews = Math.round(totalViews / videos.length);
    const totalDuration = videos.reduce((sum, video) => sum + video.durationSeconds, 0);
    
    console.log('\n📊 CHANNEL STATISTICS:');
    console.log(`📹 Total videos processed: ${videos.length}`);
    console.log(`👀 Total views: ${formatNumber(totalViews)}`);
    console.log(`📈 Average views per video: ${formatNumber(avgViews)}`);
    console.log(`⏱️  Total duration: ${formatDuration(totalDuration)}`);
    console.log(`📺 Channel: ${videos[0].channelName}`);
}

/**
 * Sort videos by specified criteria
 * @param {Array} videos - Array of video objects
 * @param {string} sortBy - Sort criteria ('views', 'duration', 'publishDate')
 * @param {boolean} descending - Sort in descending order
 * @returns {Array} Sorted videos
 */
function sortVideos(videos, sortBy = 'views', descending = true) {
    return videos.sort((a, b) => {
        let valueA, valueB;
        
        switch (sortBy) {
            case 'views':
                valueA = a.views;
                valueB = b.views;
                break;
            case 'duration':
                valueA = a.durationSeconds;
                valueB = b.durationSeconds;
                break;
            case 'publishDate':
                valueA = new Date(a.publishDate);
                valueB = new Date(b.publishDate);
                break;
            default:
                valueA = a.views;
                valueB = b.views;
        }
        
        if (descending) {
            return valueB - valueA;
        } else {
            return valueA - valueB;
        }
    });
}

module.exports = {
    formatDuration,
    formatNumber,
    saveToFile,
    displayStats,
    sortVideos
};