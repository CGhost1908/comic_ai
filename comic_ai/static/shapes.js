let isDrawing = false; // Çizim yapılıp yapılmadığını kontrol etmek için flag
let canvas, ctx; // Canvas ve context
let mode = 'cursor'; // Başlangıçta cursor modunda

// Cursor butonuna tıklandığında çağrılacak fonksiyon
function selectCursor() {
    mode = 'cursor';
    changeCursor('default'); // İmleci normal hale getir
    removeCanvasEvents(); // Çizim olaylarını kaldır

    document.querySelector('.cursor-button').style.backgroundColor = '#9c34d9';
    document.querySelector('.brush-button').style.backgroundColor = '#7b27ac';
    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.style.pointerEvents = 'none';
    });
}

// Brush butonuna tıklandığında çağrılacak fonksiyon
function selectBrush() {
    mode = 'brush';
    changeCursor('crosshair'); // Çizim için uygun imleç
    startDrawing(); // Çizimi başlat

    document.querySelector('.cursor-button').style.backgroundColor = '#7b27ac';
    document.querySelector('.brush-button').style.backgroundColor = '#9c34d9';
    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.style.pointerEvents = 'all';
    });
}

// Canvas oluşturma ve çizim başlatma
function startDrawing() {
    if (canvas) {
        // Canvas zaten varsa, yeni bir tane oluşturma
        return;
    }

    // Canvas oluşturma
    const clickedElement = document.querySelector('.page');
    canvas = document.createElement('canvas');
    canvas.classList.add('canvas');
    
    const pageRect = clickedElement.getBoundingClientRect();
    canvas.width = pageRect.width;
    canvas.height = pageRect.height;

    clickedElement.insertBefore(canvas, clickedElement.querySelector('.page-settings'));

    ctx = canvas.getContext('2d');
    ctx.lineWidth = 2; // Çizgi kalınlığı
    ctx.strokeStyle = '#000'; // Çizgi rengi (siyah)

    // Çizim başlaması için mouse down olayını kullan
    canvas.addEventListener('mousedown', function(event) {
        if (mode !== 'brush') return; // Eğer mod brush değilse, çizim yapma
        isDrawing = true; // Çizim başladığını işaretle
        const x = event.clientX - pageRect.left;
        const y = event.clientY - pageRect.top;

        ctx.beginPath();
        ctx.moveTo(x, y);

        // Mouse hareket ederken çizim yap
        canvas.addEventListener('mousemove', onMouseMove);
    });

    // Çizim bittiğinde mouse'u bıraktığında durdur
    canvas.addEventListener('mouseup', function() {
        isDrawing = false;
        canvas.removeEventListener('mousemove', onMouseMove);

        // Fonksiyonu durdur ve yeni bir çizim için izin ver
        // Burada diğer işlemleri de yapabiliriz (örneğin SVG'ye dönüştürmek)
    });
}

// Mouse hareket ederken çizim yapmak
function onMouseMove(event) {
    if (!isDrawing) return;

    const pageRect = document.querySelector('.page').getBoundingClientRect();
    const x = event.clientX - pageRect.left;
    const y = event.clientY - pageRect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
}

// Canvas üzerinde çizim yapmayı engelle
function removeCanvasEvents() {
    if (canvas) {
        canvas.removeEventListener('mousedown', startDrawing);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseup', function() {});
    }
}

// İmleç tipi değiştirme fonksiyonu
function changeCursor(type) {
    document.body.style.cursor = type;
}


function selectLine() {
    // change cursor
    changeCursor('line');
    
    const clickHandler = function (event) {
        const clickedElement = event.target;

        if (clickedElement.classList.contains('page')) {
            const canvas = document.createElement('canvas');
            canvas.classList.add('canvas');
            
            const pageRect = clickedElement.getBoundingClientRect();
            canvas.width = pageRect.width;
            canvas.height = pageRect.height;
            
            clickedElement.insertBefore(canvas, clickedElement.querySelector('.page-settings'));

            const ctx = canvas.getContext('2d');
            ctx.lineWidth = 2; // Çizgi kalınlığı
            ctx.strokeStyle = '#000'; // Çizgi rengi (siyah)

            const x = event.clientX - pageRect.left;
            const y = event.clientY - pageRect.top;

            let lastX = x;
            let lastY = y;

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);

            let clickCount = 1;

            // Minimum ve maksimum koordinatları izlemek için değişkenler
            let minX = lastX, minY = lastY, maxX = lastX, maxY = lastY;

            canvas.addEventListener('click', function (e) {
                if (clickCount > 0) {
                    const newX = e.clientX - pageRect.left;
                    const newY = e.clientY - pageRect.top;

                    ctx.lineTo(newX, newY);
                    ctx.stroke();

                    // Çizilen çizginin etrafındaki en küçük kutuyu güncelle
                    minX = Math.min(minX, newX);
                    minY = Math.min(minY, newY);
                    maxX = Math.max(maxX, newX);
                    maxY = Math.max(maxY, newY);

                    lastX = newX;
                    lastY = newY;

                    clickCount--;

                    if (clickCount === 0) {
                        resetCursor();
                        document.querySelector('.inner').removeEventListener('click', clickHandler);

                        // Convert canvas to PNG first
                        const imageUrl = canvas.toDataURL('image/png');

                        // Create image element with PNG source
                        const img = document.createElement('img');
                        img.classList.add('shape-image');
                        img.classList.add('canvas-image');
                        img.src = imageUrl;

                        canvas.remove();
                        clickedElement.insertBefore(img, clickedElement.querySelector('.page-settings'));

                        // Şimdi çizimi SVG'ye dönüştür
                        const svgNamespace = "http://www.w3.org/2000/svg";
                        const svg = document.createElementNS(svgNamespace, "svg");

                        // Çizimin etrafındaki sınırları hesapla
                        const width = maxX - minX;
                        const height = maxY - minY;
                        svg.setAttribute("width", width);
                        svg.setAttribute("height", height);
                        svg.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);

                        // Çizgiyi SVG'ye ekle
                        const line = document.createElementNS(svgNamespace, "path");
                        const pathData = ctx.getPathData(); // Canvas'tan path verisi al
                        line.setAttribute("d", pathData);
                        line.setAttribute("stroke", "#000");
                        line.setAttribute("stroke-width", "2");
                        line.setAttribute("fill", "none");
                        svg.appendChild(line);

                        const svgString = new XMLSerializer().serializeToString(svg);
                        const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

                        const svgImg = document.createElement('img');
                        svgImg.src = svgDataUrl;
                        clickedElement.appendChild(svgImg);
                    }
                }
            });
        }
    };
    document.querySelector('.inner').addEventListener('click', clickHandler);
}


function selectCircle() {
    changeCursor('circle');

    let isCircleCreated = false; // Dairenin oluşturulup oluşturulmadığını takip eden bayrak

    const clickHandler = function (event) {
        if (isCircleCreated) {
            console.log("Daire zaten oluşturuldu, yeni daire oluşturulmayacak.");
            return; // Daire zaten oluşturulduysa işlemi durdur
        }

        const clickedElement = event.target;

        if (clickedElement.classList.contains('page')) {
            const canvas = document.createElement('canvas');
            canvas.classList.add('canvas');

            const pageRect = clickedElement.getBoundingClientRect();
            canvas.width = pageRect.width;
            canvas.height = pageRect.height;

            clickedElement.insertBefore(canvas, clickedElement.querySelector('.page-settings'));

            const ctx = canvas.getContext('2d');
            ctx.lineWidth = 2; // Çizgi kalınlığı
            ctx.strokeStyle = '#000'; // Çizgi rengi (siyah)

            const x = event.clientX - pageRect.left;
            const y = event.clientY - pageRect.top;

            // Daire çizimi
            ctx.beginPath();
            const radius = 20; // Dairenin yarıçapı
            ctx.arc(x, y, radius, 0, Math.PI * 2); // Tam bir çember çizmek için 0'dan 2π'ye kadar açı
            ctx.stroke();

            const svgNamespace = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNamespace, "svg");
            svg.setAttribute("width", canvas.width);
            svg.setAttribute("height", canvas.height);
            svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);

            const circle = document.createElementNS(svgNamespace, "circle");
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", radius);
            circle.setAttribute("stroke", "#000");
            circle.setAttribute("stroke-width", "2");
            circle.setAttribute("fill", "none");
            svg.appendChild(circle);

            const padding = 5;
            const minX = x - radius - padding;
            const minY = y - radius - padding;
            const width = radius * 2 + padding * 2;
            const height = radius * 2 + padding * 2;

            svg.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);
            svg.setAttribute("width", width);
            svg.setAttribute("height", height);

            const svgString = new XMLSerializer().serializeToString(svg);
            const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

            const createCircle = document.createElement('img');
            createCircle.src = svgDataUrl;
            createCircle.classList.add('canvas-image');
            canvas.remove();
            clickedElement.insertBefore(createCircle, clickedElement.querySelector('.page-settings'));

            resetCursor();

            isCircleCreated = true;
        }
    };

    document.querySelector('.inner').addEventListener('click', clickHandler);
}


function selectSquare() {
    changeCursor('square');

    let isSquareCreated = false; // Karenin oluşturulup oluşturulmadığını takip eden bayrak

    const clickHandler = function (event) {
        if (isSquareCreated) {
            console.log("Kare zaten oluşturuldu, yeni kare oluşturulmayacak.");
            return; // Kare zaten oluşturulduysa işlemi durdur
        }

        const clickedElement = event.target;

        if (clickedElement.classList.contains('page')) {
            const canvas = document.createElement('canvas');
            canvas.classList.add('canvas');

            const pageRect = clickedElement.getBoundingClientRect();
            canvas.width = pageRect.width;
            canvas.height = pageRect.height;

            clickedElement.insertBefore(canvas, clickedElement.querySelector('.page-settings'));

            const ctx = canvas.getContext('2d');
            ctx.lineWidth = 2; // Çizgi kalınlığı
            ctx.strokeStyle = '#000'; // Çizgi rengi (siyah)

            const x = event.clientX - pageRect.left;
            const y = event.clientY - pageRect.top;

            // Kare çizimi
            const size = 40; // Karenin boyutu (genişlik ve yükseklik)
            ctx.strokeRect(x - size / 2, y - size / 2, size, size);

            const svgNamespace = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNamespace, "svg");
            svg.setAttribute("width", canvas.width);
            svg.setAttribute("height", canvas.height);
            svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);

            const rect = document.createElementNS(svgNamespace, "rect");
            rect.setAttribute("x", x - size / 2);
            rect.setAttribute("y", y - size / 2);
            rect.setAttribute("width", size);
            rect.setAttribute("height", size);
            rect.setAttribute("stroke", "#000");
            rect.setAttribute("stroke-width", "2");
            rect.setAttribute("fill", "none");
            svg.appendChild(rect);

            const padding = 5;
            const minX = x - size / 2 - padding;
            const minY = y - size / 2 - padding;
            const width = size + padding * 2;
            const height = size + padding * 2;

            svg.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);
            svg.setAttribute("width", width);
            svg.setAttribute("height", height);

            const svgString = new XMLSerializer().serializeToString(svg);
            const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

            const createSquare = document.createElement('img');
            createSquare.src = svgDataUrl;
            createSquare.classList.add('canvas-image'); // Karenin sınıfını ekle
            canvas.remove();
            clickedElement.insertBefore(createSquare, clickedElement.querySelector('.page-settings'));

            resetCursor();

            isSquareCreated = true; // Karenin oluşturulduğunu işaretle
        }
    };

    document.querySelector('.inner').addEventListener('click', clickHandler);
}


function selectTriangle() {
    changeCursor('triangle');

    let isTriangleCreated = false; // Üçgenin oluşturulup oluşturulmadığını takip eden bayrak

    const clickHandler = function (event) {
        if (isTriangleCreated) {
            console.log("Üçgen zaten oluşturuldu, yeni üçgen oluşturulmayacak.");
            return; // Üçgen zaten oluşturulduysa işlemi durdur
        }

        const clickedElement = event.target;

        if (clickedElement.classList.contains('page')) {
            const canvas = document.createElement('canvas');
            canvas.classList.add('canvas');

            const pageRect = clickedElement.getBoundingClientRect();
            canvas.width = pageRect.width;
            canvas.height = pageRect.height;

            clickedElement.insertBefore(canvas, clickedElement.querySelector('.page-settings'));

            const ctx = canvas.getContext('2d');
            ctx.lineWidth = 2; // Çizgi kalınlığı
            ctx.strokeStyle = '#000'; // Çizgi rengi (siyah)

            const x = event.clientX - pageRect.left;
            const y = event.clientY - pageRect.top;

            // Üçgenin köşe koordinatları
            const size = 40; // Üçgenin taban genişliği ve yüksekliği
            const x1 = x;
            const y1 = y - size / 2; // Üst köşe
            const x2 = x - size / 2;
            const y2 = y + size / 2; // Sol alt köşe
            const x3 = x + size / 2;
            const y3 = y + size / 2; // Sağ alt köşe

            // Üçgen çizimi
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();
            ctx.stroke();

            const svgNamespace = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNamespace, "svg");
            svg.setAttribute("width", canvas.width);
            svg.setAttribute("height", canvas.height);
            svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);

            const polygon = document.createElementNS(svgNamespace, "polygon");
            polygon.setAttribute("points", `${x1},${y1} ${x2},${y2} ${x3},${y3}`);
            polygon.setAttribute("stroke", "#000");
            polygon.setAttribute("stroke-width", "2");
            polygon.setAttribute("fill", "none");
            svg.appendChild(polygon);

            const padding = 5;
            const minX = Math.min(x1, x2, x3) - padding;
            const minY = Math.min(y1, y2, y3) - padding;
            const width = Math.max(x1, x2, x3) - minX + padding;
            const height = Math.max(y1, y2, y3) - minY + padding;

            svg.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);
            svg.setAttribute("width", width);
            svg.setAttribute("height", height);

            const svgString = new XMLSerializer().serializeToString(svg);
            const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

            const createTriangle = document.createElement('img');
            createTriangle.src = svgDataUrl;
            createTriangle.classList.add('canvas-image'); // Üçgenin sınıfını ekle
            canvas.remove();
            clickedElement.insertBefore(createTriangle, clickedElement.querySelector('.page-settings'));

            resetCursor();

            isTriangleCreated = true; // Üçgenin oluşturulduğunu işaretle
        }
    };

    document.querySelector('.inner').addEventListener('click', clickHandler);
}


function selectStar() {
    changeCursor('star');

    let isStarCreated = false; // Yıldızın oluşturulup oluşturulmadığını takip eden bayrak

    const clickHandler = function (event) {
        if (isStarCreated) {
            console.log("Yıldız zaten oluşturuldu, yeni yıldız oluşturulmayacak.");
            return; // Yıldız zaten oluşturulduysa işlemi durdur
        }

        const clickedElement = event.target;

        if (clickedElement.classList.contains('page')) {
            const canvas = document.createElement('canvas');
            canvas.classList.add('canvas');

            const pageRect = clickedElement.getBoundingClientRect();
            canvas.width = pageRect.width;
            canvas.height = pageRect.height;

            clickedElement.insertBefore(canvas, clickedElement.querySelector('.page-settings'));

            const ctx = canvas.getContext('2d');
            ctx.lineWidth = 2; // Çizgi kalınlığı
            ctx.strokeStyle = '#000'; // Çizgi rengi (siyah)

            const x = event.clientX - pageRect.left;
            const y = event.clientY - pageRect.top;

            // Yıldız çizimi için parametreler
            const outerRadius = 30; // Yıldızın dış yarıçapı
            const innerRadius = 15; // Yıldızın iç yarıçapı
            const spikes = 5; // Yıldızın sivri uç sayısı (5 için düzgün yıldız)

            const svgNamespace = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNamespace, "svg");
            svg.setAttribute("width", canvas.width);
            svg.setAttribute("height", canvas.height);
            svg.setAttribute("viewBox", `0 0 ${canvas.width} ${canvas.height}`);

            let rot = Math.PI / 2 * 3; // Başlangıç açısı
            let points = "";
            const step = Math.PI / spikes; // Her bir uç arasındaki açı

            // Yıldızın dış ve iç köşe noktalarını hesapla
            for (let i = 0; i < spikes; i++) {
                let x1 = x + Math.cos(rot) * outerRadius;
                let y1 = y + Math.sin(rot) * outerRadius;
                points += `${x1},${y1} `;

                rot += step;

                let x2 = x + Math.cos(rot) * innerRadius; // İç köşe
                let y2 = y + Math.sin(rot) * innerRadius;
                points += `${x2},${y2} `;
                rot += step;
            }

            const star = document.createElementNS(svgNamespace, "polygon");
            star.setAttribute("points", points.trim());
            star.setAttribute("stroke", "#000");
            star.setAttribute("stroke-width", "2");
            star.setAttribute("fill", "none");
            svg.appendChild(star);

            const padding = 5;
            const minX = x - outerRadius - padding;
            const minY = y - outerRadius - padding;
            const width = outerRadius * 2 + padding * 2;
            const height = outerRadius * 2 + padding * 2;

            svg.setAttribute("viewBox", `${minX} ${minY} ${width} ${height}`);
            svg.setAttribute("width", width);
            svg.setAttribute("height", height);

            const svgString = new XMLSerializer().serializeToString(svg);
            const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

            const createStar = document.createElement('img');
            createStar.src = svgDataUrl;
            createStar.classList.add('canvas-image'); // Yıldızın sınıfını ekle
            canvas.remove();
            clickedElement.insertBefore(createStar, clickedElement.querySelector('.page-settings'));

            resetCursor();

            isStarCreated = true; // Yıldızın oluşturulduğunu işaretle
        }
    };

    document.querySelector('.inner').addEventListener('click', clickHandler);
}
