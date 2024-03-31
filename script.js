const jsonURL = 'images.json';

window.onload = function() {
    loadImages();
};

function loadImages() {
    fetch(jsonURL)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('table#imageTable tbody');
            data.forEach((image, index) => {
                const row = document.createElement('tr');
                const imageName = getImageNameFromURL(image.url); // 画像名を取得

                // 画像名が一定の文字数を超える場合は省略する
                const maxNameLength = 40; // 例として20文字まで表示すると設定
                const truncatedName = imageName.length > maxNameLength ? imageName.substring(0, maxNameLength) + '...' : imageName;

                // タグを文字列に変換
                const tags = image.tags.join(', ');

                // "ロゴ"という文字列が含まれている場合は"NO preview"を表示
                const imagePreview = image.description.includes(".") ? "NO preview" : `<img src="${image.url}" alt="${image.description}" onclick="openModal('${image.url}')" class="image-img">`;

                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td title="${imageName}">${truncatedName}</td>
                    <td>${imagePreview}</td>
                    <td>${image.description}</td>
                    <td>${tags}</td>
                    <td><a href="${image.url}" target="_blank" class="button">画像へアクセス</a></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('画像の取得エラー:', error));
}

// 画像名の表示関数を修正
function openModal(imgSrc) {
    var modal = document.getElementById("myModal");
    var modalImg = document.getElementById("modalImg");
    var modalImageName = document.getElementById("modalImageName");

    modal.style.display = "block";
    modalImg.src = imgSrc;

    // 画像名を取得
    var imageName = getImageNameFromURL(imgSrc);

    // 画像名を切り詰める
    var truncatedName = truncateText(imageName, 70); // 20文字までに切り詰める（適宜変更）

    // 画像名の表示
    modalImageName.textContent = truncatedName;
}

// テキストを切り詰める関数
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...'; // 切り詰めて...を追加
    }
    return text;
}




function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
}

function filterImages() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const tagSelect = document.getElementById("tagSelect").value.toLowerCase();

    const rows = document.querySelectorAll('table#imageTable tbody tr'); // 各画像の行を取得

    let count = 0;

    rows.forEach(row => {
        const name = row.querySelector('td:nth-child(2)').innerText.toLowerCase();
        const description = row.querySelector('td:nth-child(4)').innerText.toLowerCase();
        const tags = row.children[4].innerText.toLowerCase(); // 各行のタグを取得

        if ((name.includes(searchInput) || description.includes(searchInput)) &&
            (tagSelect === "" || tags.includes(tagSelect))) {
            row.style.display = "";
            count++;
        } else {
            row.style.display = "none";
        }
    });

    const searchResult = document.getElementById("searchResult");
    if (count > 0) {
        searchResult.textContent = `検索結果は${count}個です。`;
    } else {
        searchResult.textContent = "何も見つかりませんでした。";
    }
}

function toggleSearchField() {
    filterImages(); // 検索を開始
}


function getImageNameFromURL(url) {
    return url.substring(url.lastIndexOf('/') + 1); // URLから画像名を取得
}