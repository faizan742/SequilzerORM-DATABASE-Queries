require("dotenv").config();
const Queue = require('bull');
const DownloadQueue = new Queue('DownloadCSV');
const https = require('https');
const fs = require('fs');
const path = require('path');

async function downloadfile(uuidcode) {

  const fileUrl = `../Upload/${uuidcode}.csv`;

  const downloadFolderPath = path.join(require('os').homedir(), 'Downloads');
  const localFilePath = path.join(downloadFolderPath, 'downloaded_file.csv');
  const file = fs.createWriteStream(localFilePath,{ encoding: 'binary' });
  console.log(fileUrl);  
  https.get(fileUrl, (response) => {
    response.on('data', (chunk) => {
      file.write(chunk, 'binary');
    });

    response.on('end', () => {
      file.end();
      console.log('File downloaded successfully');
    });
  }).on('error', (err) => {
    fs.unlink(localFilePath, () => {}); // Delete the file if there's an error
    console.error('Error downloading file:', err);
  });  
}


function DownloadData(name) {

  DownloadQueue.add({name:name});
}

DownloadQueue.process((job,done)=>{
  
    downloadfile(job.data.name).then((result) => {
      console.log('DONE')
    }).catch((err) => {
      
    });
});



DownloadQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});
function pasueQuene() {
  DownloadQueue.pause();
  DownloadQueue.empty().then(() => {
    console.log('Queue emptied successfully.');
  }).catch((err) => {
    console.error('Error emptying the queue:', err);
  });
  DownloadQueue.clean(0, 'failed').then(() => {
    console.log('Failed jobs removed successfully.');
  }).catch((err) => {
    console.error('Error removing failed jobs:', err);
  });
  DownloadQueue.resume();
}
module.exports = {DownloadQueue,DownloadData,pasueQuene}; // Export the emailQueue variable
