
let width = 0;
function move(width){
  const progress = document.querySelector('.progress');
  
  progress.style.width = 12.5 + width + "%";
   if(width == 50){
    setTimeout(() => {
      completeExport();
      width = 12.5;
    }, 1000)
  }
}

function openLoadingPopup(){
    document.querySelector('.popup-main').style.display = 'flex';
    document.querySelector('.export-loading-popup').style.display = 'flex';
    createPdf();
}


function exportComic(){
    openLoadingPopup();
}


const { jsPDF } = window.jspdf;

let doc;
async function createPdf(){
    const opt1 = {
        filename: 'output.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          height: 296.9 * 3.77953
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    const pages = document.querySelector('.pages');
    const pageLength = document.querySelectorAll('.page').length;
    doc = html2pdf().set(opt1).from(pages).toPdf()
    setTimeout(() => {
      move(1 / pageLength * 50);
    }, 30)
    doc = doc.get('pdf');


    for (let j = 1; j < pageLength; j++){
      const opt2 = {
        filename: 'output.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          y: j * (296.9 * 3.77953 + 20),
          height: 296.9 * 3.77953
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      doc = doc.get('pdf').then(
        pdf => { pdf.addPage()}
      ).from(pages).set(opt2).toContainer().toCanvas().toPdf()
      setTimeout(() => {
        move((j+1) / pageLength * 50);
      }, 30);
    }
}
  
function downloadPdf(){
  doc.save()
}

async function completeExport() {
  move(75);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  await doc.save();
  move(87.5);
  document.querySelector('.progress').style.transition = `width .15s ease-out`;
  await new Promise(resolve => setTimeout(resolve, 150));
  
  document.querySelector('.popup-main').style.display = 'none';
  document.querySelector('.export-loading-popup').style.display = 'none';
  document.querySelector('.progress').style.width = '0';
  move(0)
  document.querySelector('.progress').style.transition = `width 1s ease-out`;
}
