const { extractChannelInfo } = require('./src/extractor');
const { displayStats, saveToFile } = require('./src/utils');

// Configuration
const CONFIG = {
    DEFAULT_CHANNEL: '@MrBeast',
    MAX_VIDEOS: 20
};

/**
 * Main function - Entry point of the application
 */
async function main() {
    // Get channel name from command line arguments or use default
    const channelName = process.argv[2] || CONFIG.DEFAULT_CHANNEL;
    
    console.log('🚀 YouTube Channel Video Extractor');
    console.log('=====================================');
    
    // Extract video information
    const videos = await extractChannelInfo(channelName, CONFIG.MAX_VIDEOS);
    
    if (videos.length > 0) {
        // Display statistics
        displayStats(videos);
        
        // Save to file
        saveToFile(videos, channelName);
        
        // Display first few videos as sample
        console.log('\n📝 SAMPLE VIDEOS:');
        videos.slice(0, 3).forEach((video, index) => {
            console.log(`\n${index + 1}. ${video.title}`);
            console.log(`   👀 Views: ${video.views.toLocaleString()}`);
            console.log(`   ⏱️  Duration: ${video.duration}`);
            console.log(`   🔗 URL: ${video.url}`);
        });
        
        console.log('\n✅ Extraction completed successfully!');
    } else {
        console.log('❌ No videos were extracted. Please check the channel name and try again.');
    }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Run the main function
main().catch(console.error);