require("dotenv").config();
const csvWriter = require('csv-writer');
const path=require('path');

const Queue = require('bull');

const uploadQueue = new Queue('CSVdata');
function MakeCSV(uuidvalue,data) {
  const writer = csvWriter.createObjectCsvWriter({
      path: path.resolve(__dirname, `../Upload/${uuidvalue}.csv`),
      header: [
        { id: 'productCode', title: "productCode" },
        { id: 'productName', title: 'productName' },
        { id: 'productLine', title: 'productLine' },
        { id: 'productScale', title: 'productScale' },
        { id: 'productVendor', title: 'productVendor' },
        { id: 'productDescription', title: 'productDescription' },
        { id: 'quantityInStock', title: 'quantityInStock' },
        { id: 'buyPrice', title: 'buyPrice' },
        { id: 'MSRP', title: 'MSRP' },
      ],
    });
    writer.writeRecords(data).then(() => {
      console.log('Done!');
    });  
}
function saveData(name,data) {
    uploadQueue.add({name:name,data:data});
}

uploadQueue.process((job,done)=>{
    console.log(job);
    MakeCSV(job.data.name,job.data.data);     
});



uploadQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed with error: ${err.message}`);
});
function pasueQuene() {
    uploadQueue.pause();
    uploadQueue.empty().then(() => {
    console.log('Queue emptied successfully.');
  }).catch((err) => {
    console.error('Error emptying the queue:', err);
  });
  uploadQueue.clean(0, 'failed').then(() => {
    console.log('Failed jobs removed successfully.');
  }).catch((err) => {
    console.error('Error removing failed jobs:', err);
  });
  uploadQueue.resume();
}
module.exports = {uploadQueue,saveData,pasueQuene}; 
