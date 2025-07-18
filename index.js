const { extractChannelInfo } = require('./src/extractor');
const { displayStats, saveToFile } = require('./src/utils');

const CONFIG = {
    DEFAULT_CHANNEL: '@SoloFonseca',
    MAX_VIDEOS: 5
};


async function main() {
    // Get channel name from command line arguments or use default
    const channelName = process.argv[2] || CONFIG.DEFAULT_CHANNEL;
    
    console.log('🚀 YouTube Channel Video Extractor');
    console.log('=====================================');    
    const videos = await extractChannelInfo(channelName, CONFIG.MAX_VIDEOS);
    
    if (videos.length > 0) {
        displayStats(videos);
        saveToFile(videos, channelName);
        console.log('\n✅ Extraction completed successfully!');
    } else {
        console.log('❌ No videos were extracted. Please check the channel name and try again.');
    }
}

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

main().catch(console.error);