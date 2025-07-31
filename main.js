const { app, BrowserWindow } = require('electron');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'Excel Veri Yöneticisi'
  });

  const htmlContent = createHTMLContent();
  mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createHTMLContent() {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Excel Veri Yöneticisi</title>
<style>
body { font-family: Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0; padding: 20px; min-height: 100vh; }
.container { max-width: 1000px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
.title { text-align: center; color: #2563eb; font-size: 2.5rem; margin-bottom: 10px; }
.subtitle { text-align: center; color: #666; font-size: 1.2rem; margin-bottom: 30px; }
.status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
.status-card { text-align: center; padding: 20px; border-radius: 8px; background: #dcfce7; color: #166534; }
.status-icon { font-size: 2rem; margin-bottom: 10px; }
.upload-area { border: 2px dashed #ccc; padding: 40px; text-align: center; margin: 20px 0; border-radius: 8px; cursor: pointer; background: #f9f9f9; }
.upload-area:hover { border-color: #2563eb; background: #f0f9ff; }
.btn { background: #2563eb; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin: 10px; font-size: 16px; }
.btn:hover { background: #1d4ed8; }
.btn-success { background: #059669; }
.btn-danger { background: #dc2626; }
.btn-warning { background: #d97706; }
.data-section { display: none; margin-top: 30px; }
.search-box { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; }
.data-table { width: 100%; border-collapse: collapse; margin: 20px 0; min-width: 800px; }
.data-table th, .data-table td { border: 1px solid #ddd; padding: 10px; text-align: left; min-width: 120px; white-space: nowrap; }
.data-table th { background: #f2f2f2; font-weight: bold; position: sticky; top: 0; z-index: 10; }
.data-table tr:hover { background: #f5f5f5; cursor: pointer; }
.table-container { overflow-x: auto; overflow-y: auto; max-height: 500px; border: 1px solid #ddd; border-radius: 8px; }
.filter-container { display: flex; gap: 15px; align-items: center; margin: 20px 0; flex-wrap: wrap; }
.filter-select { padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; min-width: 150px; }
.modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; }
.modal.show { display: flex; align-items: center; justify-content: center; }
.modal-content { background: white; padding: 30px; border-radius: 10px; max-width: 800px; width: 95%; max-height: 90vh; overflow-y: auto; }
.member-info-grid { display: grid; grid-template-columns: 1fr 300px; gap: 30px; margin: 20px 0; }
.member-details { max-height: 400px; overflow-y: auto; }
.member-detail-item { margin-bottom: 15px; padding: 12px; background: #f8fafc; border-radius: 6px; border-left: 4px solid #2563eb; }
.member-detail-item.empty { background: #fef3c7; border-left-color: #f59e0b; }
.member-detail-item.edit-mode { background: #fff3cd; border-left-color: #ffc107; }
.editable-field { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.editable-input { flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; min-height: 20px; }
.editable-input:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1); }
.edit-btn { padding: 5px 10px; font-size: 12px; border: none; border-radius: 4px; cursor: pointer; background: #059669; color: white; }
.edit-btn:hover { background: #047857; }
.save-edit-btn { background: #2563eb; }
.save-edit-btn:hover { background: #1d4ed8; }
.photo-upload-area { border: 2px dashed #ddd; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; cursor: pointer; }
.photo-upload-area:hover { border-color: #2563eb; background: #f0f9ff; }
.uploaded-photo { max-width: 250px; max-height: 250px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.notes-textarea { width: 100%; min-height: 120px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; font-family: Arial, sans-serif; font-size: 14px; resize: vertical; }
.notes-textarea:focus { border-color: #2563eb; outline: none; box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1); }
.char-counter { text-align: right; font-size: 12px; color: #666; margin-top: 5px; }
.char-counter.warning { color: #dc2626; font-weight: bold; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; float: right; }
.success-message { background: #dcfce7; color: #166534; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-weight: bold; }
.current-file-info { background: #e0f2fe; color: #0277bd; padding: 12px; border-radius: 6px; margin: 15px 0; font-weight: bold; }
.empty-value { color: #9ca3af; font-style: italic; }
</style>
</head>
<body>
<div class="container">
<h1 class="title">📊 Excel Veri Yöneticisi</h1>
<p class="subtitle">Excel dosyalarınızı CSV formatında kolayca yönetin</p>
<div class="success-message">🎉 Uygulama başarıyla çalışıyor! CSV dosyalarınızı yükleyebilirsiniz.</div>
<div id="currentFileInfo" class="current-file-info" style="display: none;">
<span id="currentFileName">📁 Mevcut dosya: Henüz dosya seçilmedi</span>
</div>
<div class="status-grid">
<div class="status-card"><div class="status-icon">⚡</div><div><strong>Electron</strong></div><div>Aktif</div></div>
<div class="status-card"><div class="status-icon">💾</div><div><strong>Veri Depolama</strong></div><div id="storageStatus">Çalışıyor</div></div>
<div class="status-card"><div class="status-icon">📊</div><div><strong>Kayıtlı Veriler</strong></div><div id="dataCount">0 kayıt</div></div>
<div class="status-card"><div class="status-icon">👥</div><div><strong>Üye Notları</strong></div><div id="notesCount">0 not</div></div>
</div>
<div class="upload-area">
<div style="font-size: 3rem; margin-bottom: 15px;">📁</div>
<h3>CSV dosyası seçmek için tıklayın</h3>
<p>Excel dosyanızı CSV formatında kaydedin ve buraya yükleyin</p>
<input type="file" id="fileInput" style="display: none;" accept=".csv,.txt">
</div>
<div style="text-align: center;">
<button class="btn" id="selectBtn">📤 CSV Dosyası Seç</button>
<button class="btn btn-success" id="loadBtn">📂 Son Çalışmaya Devam Et</button>
<button class="btn btn-warning" id="saveCurrentBtn" style="display: none;">💾 Mevcut Çalışmayı Kaydet</button>
<button class="btn btn-danger" id="clearBtn">🗑️ Tüm Verileri Temizle</button>
</div>
<div id="dataSection" class="data-section">
<h3>📊 Veriler</h3>
<div class="filter-container">
<label><strong>🔍 Arama:</strong></label>
<input type="text" id="searchBox" class="search-box" placeholder="Arama yapın..." style="margin: 0; flex: 1;">
<label><strong>📋 Filtre:</strong></label>
<select id="filterColumn" class="filter-select"><option value="">Tüm Sütunlar</option></select>
</div>
<div class="table-container">
<table id="dataTable" class="data-table"><thead id="tableHead"></thead><tbody id="tableBody"></tbody></table>
</div>
<div style="text-align: center; margin-top: 20px;">
<button class="btn btn-success" id="saveBtn">💾 Verileri Kaydet</button>
<button class="btn" id="exportBtn">📤 Dışa Aktar (CSV)</button>
</div>
</div>
</div>
<div id="memberModal" class="modal">
<div class="modal-content">
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
<h3>👤 Üye Detayları</h3>
<button class="close-btn" id="closeModalBtn">×</button>
</div>
<div class="member-info-grid">
<div class="member-details">
<h4>📋 Kişisel Bilgiler <button class="btn edit-btn" id="editMemberBtn">✏️ Düzenle</button></h4>
<div id="memberDetails"></div>
</div>
<div>
<h4>📸 Fotoğraf</h4>
<div class="photo-upload-area" id="photoUploadArea">
<div id="photoDisplay">
<div style="font-size: 2rem; margin-bottom: 10px;">📷</div>
<p>Fotoğraf eklemek için tıklayın</p>
<small>Maksimum 5MB (JPG, PNG)</small>
</div>
<input type="file" id="photoInput" style="display: none;" accept="image/*">
</div>
<h4>📝 Notlar</h4>
<textarea id="memberNotes" class="notes-textarea" placeholder="Üye hakkında notlarınızı yazın..." maxlength="500"></textarea>
<div id="charCounter" class="char-counter">0/500 karakter</div>
</div>
</div>
<div style="text-align: center; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
<button class="btn" id="exportPdfBtn">📄 Rapor Olarak Kaydet</button>
<button class="btn btn-success" id="saveMemberBtn">💾 Bilgileri Kaydet</button>
<button class="btn" id="closeMemberBtn">❌ Kapat</button>
</div>
</div>
</div>

<script>
var allData = [];
var headers = [];
var filteredData = [];
var memberNotes = {};
var memberPhotos = {};
var selectedMemberIndex = -1;
var currentFileName = "";
var isEditMode = false;
var originalMemberData = {};
var displayedRows = 500;
var rowIncrement = 500;

window.addEventListener("load", function() {
  console.log("App started");
  setupEventListeners();
  checkStatus();
  loadSavedData();
});

function setupEventListeners() {
  var fileInput = document.getElementById("fileInput");
  var uploadArea = document.querySelector(".upload-area");
  var selectBtn = document.getElementById("selectBtn");
  
  function openFileDialog() { fileInput.click(); }
  uploadArea.addEventListener("click", openFileDialog);
  selectBtn.addEventListener("click", openFileDialog);
  
  fileInput.addEventListener("change", function(e) {
    var file = e.target.files[0];
    if (!file) return;
    currentFileName = file.name;
    updateCurrentFileDisplay();
    var reader = new FileReader();
    reader.onload = function(event) { parseCSV(event.target.result); };
    reader.readAsText(file, "UTF-8");
  });
  
  document.getElementById("loadBtn").addEventListener("click", loadSavedData);
  document.getElementById("clearBtn").addEventListener("click", clearAllData);
  document.getElementById("saveBtn").addEventListener("click", saveAllData);
  document.getElementById("saveCurrentBtn").addEventListener("click", saveCurrentWork);
  document.getElementById("exportBtn").addEventListener("click", exportData);
  
  var searchTimeout;
  document.getElementById("searchBox").addEventListener("keyup", function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchAndFilter, 300);
  });
  
  document.getElementById("filterColumn").addEventListener("change", function() {
    var filterColumn = document.getElementById("filterColumn");
    var searchBox = document.getElementById("searchBox");
    if (filterColumn.value && filterColumn.value !== "") {
      var columnName = filterColumn.options[filterColumn.selectedIndex].text;
      searchBox.placeholder = columnName + " içinde arama yapın...";
    } else {
      searchBox.placeholder = "Arama yapın...";
    }
    searchAndFilter();
  });
  
  document.getElementById("closeModalBtn").addEventListener("click", closeModal);
  document.getElementById("closeMemberBtn").addEventListener("click", closeModal);
  document.getElementById("saveMemberBtn").addEventListener("click", saveMemberData);
  document.getElementById("exportPdfBtn").addEventListener("click", exportMemberReport);
  document.getElementById("photoUploadArea").addEventListener("click", function() { 
    document.getElementById("photoInput").click(); 
  });
  document.getElementById("photoInput").addEventListener("change", handlePhotoUpload);
  document.getElementById("memberNotes").addEventListener("input", updateCharCounter);
  document.getElementById("memberModal").addEventListener("click", function(e) { 
    if (e.target.id === "memberModal") { closeModal(); } 
  });
  
  document.getElementById("editMemberBtn").addEventListener("click", function() {
    if (isEditMode) {
      allData[selectedMemberIndex] = JSON.parse(JSON.stringify(originalMemberData));
      isEditMode = false;
      displayMemberDetails();
      displayTable();
    } else {
      isEditMode = true;
      displayMemberDetails();
    }
  });
}

function updateCurrentFileDisplay() {
  var fileInfo = document.getElementById("currentFileInfo");
  var fileName = document.getElementById("currentFileName");
  if (currentFileName) {
    fileName.textContent = "📁 Mevcut dosya: " + currentFileName;
    fileInfo.style.display = "block";
    document.getElementById("saveCurrentBtn").style.display = "inline-block";
  } else {
    fileInfo.style.display = "none";
    document.getElementById("saveCurrentBtn").style.display = "none";
  }
}

function parseCSV(csvText) {
  console.log("Starting CSV parse...");
  var startTime = performance.now();
  
  var lines = csvText.split("\\n");
  var cleanLines = [];
  
  for (var i = 0; i < lines.length; i++) {
    var trimmed = lines[i].trim();
    if (trimmed) { 
      cleanLines.push(trimmed); 
    }
  }
  
  if (cleanLines.length === 0) { 
    alert("Dosya boş!"); 
    return; 
  }
  
  headers = cleanLines[0].split(",");
  for (var i = 0; i < headers.length; i++) {
    headers[i] = headers[i].trim().replace(/^"|"$/g, "");
  }
  
  allData = [];
  allData.length = cleanLines.length - 1;
  var dataIndex = 0;
  
  for (var i = 1; i < cleanLines.length; i++) {
    var row = cleanLines[i].split(",");
    var cleanRow = new Array(headers.length); // Ensure row has same length as headers
    var hasData = false;
    
    for (var j = 0; j < headers.length; j++) {
      var cell = "";
      if (j < row.length) {
        cell = row[j].trim().replace(/^"|"$/g, "");
      }
      cleanRow[j] = cell;
      if (cell && !hasData) { 
        hasData = true; 
      }
    }
    
    if (hasData) { 
      allData[dataIndex++] = cleanRow;
    }
  }
  
  allData.length = dataIndex;
  
  if (allData.length === 0) { 
    alert("Dosyada veri bulunamadı!"); 
    return; 
  }
  
  console.log("CSV parsed in", (performance.now() - startTime).toFixed(2), "ms");
  
  filteredData = allData.slice();
  displayTable();
  populateFilterOptions();
  document.getElementById("dataSection").style.display = "block";
  
  if (!memberNotes || Object.keys(memberNotes).length === 0) {
    memberNotes = {};
    memberPhotos = {};
  }
  
  alert(allData.length + " kayıt yüklendi!");
  updateCounts();
  saveCurrentWork();
}

function displayTable() {
  var tableHead = document.getElementById("tableHead");
  var tableBody = document.getElementById("tableBody");
  
  tableHead.innerHTML = "";
  tableBody.innerHTML = "";
  
  var headerRow = document.createElement("tr");
  for (var i = 0; i < headers.length; i++) {
    var th = document.createElement("th");
    th.textContent = headers[i];
    headerRow.appendChild(th);
  }
  var actionTh = document.createElement("th");
  actionTh.textContent = "İşlemler";
  headerRow.appendChild(actionTh);
  tableHead.appendChild(headerRow);
  
  var fragment = document.createDocumentFragment();
  var maxRows = Math.min(filteredData.length, displayedRows);
  
  for (var i = 0; i < maxRows; i++) {
    var tr = document.createElement("tr");
    var row = filteredData[i];
    
    tr.addEventListener("dblclick", (function(rowData) {
      return function() { showMemberDetails(rowData); };
    })(row));
    tr.title = "Çift tıklayarak detayları görüntüle";
    
    for (var j = 0; j < row.length; j++) {
      var td = document.createElement("td");
      td.textContent = row[j] || "-";
      tr.appendChild(td);
    }
    
    var actionTd = document.createElement("td");
    var btn = document.createElement("button");
    btn.textContent = "👁️ Detay";
    btn.className = "btn";
    btn.style.cssText = "padding: 5px 10px; font-size: 12px; margin: 0;";
    
    btn.addEventListener("click", (function(rowData) {
      return function(e) { 
        e.stopPropagation(); 
        showMemberDetails(rowData); 
      };
    })(row));
    
    actionTd.appendChild(btn);
    tr.appendChild(actionTd);
    fragment.appendChild(tr);
  }
  
  tableBody.appendChild(fragment);
  
  if (filteredData.length > displayedRows) {
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.colSpan = headers.length + 1;
    td.style.cssText = "text-align: center; padding: 20px; background: #f0f9ff;";
    
    var remainingRows = filteredData.length - displayedRows;
    var nextBatch = Math.min(remainingRows, rowIncrement);
    
    var loadMoreBtn = document.createElement("button");
    loadMoreBtn.className = "btn btn-success";
    loadMoreBtn.style.cssText = "margin: 10px; padding: 12px 24px; font-size: 16px;";
    loadMoreBtn.textContent = "📋 Sonraki " + nextBatch + " Kaydı Yükle (" + remainingRows + " kaldı)";
    loadMoreBtn.onclick = function() {
      displayedRows += rowIncrement;
      displayTable();
    };
    
    var infoDiv = document.createElement("div");
    infoDiv.style.cssText = "color: #0369a1; font-weight: bold; margin-bottom: 10px;";
    infoDiv.textContent = "Gösterilen: " + displayedRows + " / " + filteredData.length + " kayıt";
    
    td.appendChild(infoDiv);
    td.appendChild(loadMoreBtn);
    tr.appendChild(td);
    tableBody.appendChild(tr);
  } else if (filteredData.length > rowIncrement) {
    var tr = document.createElement("tr");
    var td = document.createElement("td");
    td.colSpan = headers.length + 1;
    td.style.cssText = "text-align: center; padding: 15px; background: #dcfce7; color: #166534; font-weight: bold;";
    td.textContent = "✅ Tüm " + filteredData.length + " kayıt gösteriliyor";
    tr.appendChild(td);
    tableBody.appendChild(tr);
  }
}

function populateFilterOptions() {
  var filterSelect = document.getElementById("filterColumn");
  filterSelect.innerHTML = '<option value="">Tüm Sütunlar</option>';
  for (var i = 0; i < headers.length; i++) {
    var option = document.createElement("option");
    option.value = i;
    option.textContent = headers[i];
    filterSelect.appendChild(option);
  }
}

function searchAndFilter() {
  var searchTerm = document.getElementById("searchBox").value.toLowerCase().trim();
  var filterColumn = document.getElementById("filterColumn").value;
  
  displayedRows = rowIncrement;
  
  if (!searchTerm && (!filterColumn || filterColumn === "")) {
    filteredData = allData.slice();
    displayTable();
    return;
  }
  
  filteredData = [];
  
  if (filterColumn && filterColumn !== "") {
    var columnIndex = parseInt(filterColumn);
    for (var i = 0; i < allData.length; i++) {
      var row = allData[i];
      var cellValue = row[columnIndex];
      if (cellValue) {
        var cellText = cellValue.toString().toLowerCase();
        if (!searchTerm || cellText.indexOf(searchTerm) >= 0) {
          filteredData.push(row);
        }
      }
    }
  } else {
    for (var i = 0; i < allData.length; i++) {
      var row = allData[i];
      var found = false;
      
      for (var j = 0; j < row.length && !found; j++) {
        if (row[j]) {
          var cellText = row[j].toString().toLowerCase();
          if (cellText.indexOf(searchTerm) >= 0) {
            found = true;
          }
        }
      }
      
      if (found) {
        filteredData.push(row);
      }
    }
  }
  
  displayTable();
}

function showMemberDetails(rowData) {
  selectedMemberIndex = -1;
  for (var i = 0; i < allData.length; i++) {
    if (JSON.stringify(allData[i]) === JSON.stringify(rowData)) {
      selectedMemberIndex = i; 
      break;
    }
  }
  
  originalMemberData = JSON.parse(JSON.stringify(rowData));
  isEditMode = false;
  displayMemberDetails();
  
  if (memberNotes[selectedMemberIndex] === undefined) {
    memberNotes[selectedMemberIndex] = "";
  }
  if (memberPhotos[selectedMemberIndex] === undefined) {
    memberPhotos[selectedMemberIndex] = null;
  }
  
  var existingNote = memberNotes[selectedMemberIndex] || "";
  var existingPhoto = memberPhotos[selectedMemberIndex] || null;
  
  var notesTextarea = document.getElementById("memberNotes");
  notesTextarea.value = existingNote;
  notesTextarea.disabled = false;
  notesTextarea.readOnly = false;
  
  updateCharCounter();
  displayPhoto(existingPhoto);
  document.getElementById("memberModal").classList.add("show");
  
  setTimeout(function() {
    notesTextarea.focus();
  }, 100);
}

// ÖNEMLİ DEĞİŞİKLİK: Boş alanları da göster ve düzenleme işlevini düzelt
function displayMemberDetails() {
  var details = document.getElementById("memberDetails");
  var rowData = allData[selectedMemberIndex];
  var html = "";
  
  // TÜM sütunları göster (boş olanlar dahil)
  for (var i = 0; i < headers.length; i++) {
    var value = rowData[i] || ""; // Boş değerler için boş string kullan
    var isEmpty = !value || value.trim() === "";
    var icon = getFieldIcon(headers[i]);
    var fieldId = "field_" + i;
    
    html += '<div class="member-detail-item' + (isEmpty ? ' empty' : '') + (isEditMode ? ' edit-mode' : '') + '">';
    html += '<div style="display: flex; align-items: center; gap: 10px;">';
    html += '<span style="font-size: 1.2rem;">' + icon + '</span>';
    html += '<div style="flex: 1;"><strong>' + headers[i] + ':</strong><br>';
    
    if (isEditMode) {
      html += '<div class="editable-field">';
      html += '<input type="text" class="editable-input" id="' + fieldId + '" value="' + (value || "").replace(/"/g, "&quot;") + '" placeholder="' + headers[i] + ' bilgisini girin...">';
      html += '<button class="edit-btn save-edit-btn" onclick="saveFieldEdit(' + i + ')">💾 Kaydet</button>';
      html += '</div>';
    } else {
      if (isEmpty) {
        html += '<span class="empty-value">Bilgi girilmemiş - düzenlemek için "Düzenle" butonuna tıklayın</span>';
      } else {
        html += '<span style="font-size: 1.1rem; color: #333;">' + value + '</span>';
      }
    }
    
    html += '</div></div></div>';
  }
  
  details.innerHTML = html;
  updateEditButton();
  
  // Düzenleme modunda ilk input'a odaklan
  if (isEditMode) {
    setTimeout(function() {
      var firstInput = details.querySelector('.editable-input');
      if (firstInput) {
        firstInput.focus();
        firstInput.select();
      }
    }, 100);
  }
}

function updateEditButton() {
  var editBtn = document.getElementById("editMemberBtn");
  if (isEditMode) {
    editBtn.textContent = "❌ İptal";
    editBtn.className = "btn btn-danger edit-btn";
  } else {
    editBtn.textContent = "✏️ Düzenle";
    editBtn.className = "btn edit-btn";
  }
}

// ÖNEMLİ DEĞİŞİKLİK: Alan kaydetme işlevini düzelt
function saveFieldEdit(fieldIndex) {
  var fieldId = "field_" + fieldIndex;
  var input = document.getElementById(fieldId);
  
  if (!input) {
    console.error("Input field not found:", fieldId);
    alert("Hata: Alan bulunamadı!");
    return;
  }
  
  var newValue = input.value.trim();
  
  // Veriyi güncelle
  allData[selectedMemberIndex][fieldIndex] = newValue;
  
  // Tabloyu güncelle
  displayTable();
  
  // Üye detaylarını güncelle
  displayMemberDetails();
  
  // Verileri kaydet
  saveCurrentWork();
  
  // Başarı mesajı
  var fieldName = headers[fieldIndex];
  if (newValue) {
    alert("✅ " + fieldName + " alanı güncellendi: " + newValue);
  } else {
    alert("✅ " + fieldName + " alanı temizlendi");
  }
}

function getFieldIcon(fieldName) {
  var field = fieldName.toLowerCase();
  if (field.includes("ad") || field.includes("isim") || field.includes("name")) return "👤";
  if (field.includes("tc") || field.includes("kimlik")) return "🆔";
  if (field.includes("tel") || field.includes("telefon") || field.includes("phone")) return "📞";
  if (field.includes("mail") || field.includes("email")) return "📧";
  if (field.includes("adres") || field.includes("address")) return "📍";
  if (field.includes("doğum") || field.includes("birth") || field.includes("yaş")) return "🎂";
  if (field.includes("meslek") || field.includes("job") || field.includes("work")) return "💼";
  if (field.includes("cinsiyet") || field.includes("gender")) return "⚥";
  if (field.includes("şehir") || field.includes("city") || field.includes("il")) return "🏙️";
  return "📋";
}

function handlePhotoUpload(event) {
  var file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { 
    alert("Fotoğraf boyutu 5MB den küçük olmalıdır."); 
    return; 
  }
  if (!file.type.startsWith("image/")) { 
    alert("Lütfen geçerli bir resim dosyası seçin."); 
    return; 
  }
  var reader = new FileReader();
  reader.onload = function(e) { displayPhoto(e.target.result); };
  reader.readAsDataURL(file);
}

function displayPhoto(photoData) {
  var photoDisplay = document.getElementById("photoDisplay");
  if (photoData) {
    photoDisplay.innerHTML = '<img src="' + photoData + '" class="uploaded-photo" alt="Üye fotoğrafı"><div style="margin-top: 10px;"><button class="btn" onclick="removePhoto()" style="padding: 5px 10px; font-size: 12px;">🗑️ Kaldır</button></div>';
  } else {
    photoDisplay.innerHTML = '<div style="font-size: 2rem; margin-bottom: 10px;">📷</div><p>Fotoğraf eklemek için tıklayın</p><small>Maksimum 5MB (JPG, PNG)</small>';
  }
}

function removePhoto() {
  displayPhoto(null);
  document.getElementById("photoInput").value = "";
}

function updateCharCounter() {
  var textarea = document.getElementById("memberNotes");
  var counter = document.getElementById("charCounter");
  var currentLength = textarea.value.length;
  counter.textContent = currentLength + "/500 karakter";
  if (currentLength > 450) { 
    counter.className = "char-counter warning"; 
  } else { 
    counter.className = "char-counter"; 
  }
}

function saveMemberData() {
  if (selectedMemberIndex >= 0) {
    var notesTextarea = document.getElementById("memberNotes");
    var notes = notesTextarea.value;
    var photoImg = document.querySelector(".uploaded-photo");
    var photoData = photoImg ? photoImg.src : null;
    
    if (!memberNotes) memberNotes = {};
    if (!memberPhotos) memberPhotos = {};
    
    memberNotes[selectedMemberIndex] = notes;
    memberPhotos[selectedMemberIndex] = photoData;
    
    try {
      localStorage.setItem("member_notes", JSON.stringify(memberNotes));
      localStorage.setItem("member_photos", JSON.stringify(memberPhotos));
      alert("✅ Üye bilgileri kaydedildi!");
      closeModal();
      updateCounts();
      saveCurrentWork();
    } catch (error) {
      console.error("Save error:", error);
      alert("❌ Kayıt sırasında hata oluştu: " + error.message);
    }
  }
}

function exportMemberReport() {
  if (selectedMemberIndex < 0) return;
  var rowData = allData[selectedMemberIndex];
  if (!rowData) return;
  
  var memberName = rowData[1] || rowData[0] || "Bilinmeyen";
  var notes = memberNotes[selectedMemberIndex] || "";
  var reportContent = "=== ÜYE BİLGİ RAPORU ===\\n\\n";
  reportContent += "Rapor Tarihi: " + new Date().toLocaleDateString("tr-TR") + "\\n";
  reportContent += "Rapor Saati: " + new Date().toLocaleTimeString("tr-TR") + "\\n\\n";
  reportContent += "=== KİŞİSEL BİLGİLER ===\\n";
  
  for (var i = 0; i < headers.length; i++) {
    var value = rowData[i] || "Belirtilmemiş";
    reportContent += "• " + headers[i] + ": " + value + "\\n";
  }
  
  if (notes && notes.trim()) {
    reportContent += "\\n=== NOTLAR ===\\n";
    reportContent += notes + "\\n";
  }
  
  var photoImg = document.querySelector(".uploaded-photo");
  if (photoImg && photoImg.src) {
    reportContent += "\\n=== FOTOĞRAF ===\\n";
    reportContent += "Fotoğraf mevcut (bu raporda görüntülenemez)\\n";
  }
  
  reportContent += "\\n" + "=".repeat(50) + "\\n";
  reportContent += "Bu rapor Excel Veri Yöneticisi tarafından oluşturulmuştur.\\n";
  reportContent += "Oluşturulma: " + new Date().toLocaleString("tr-TR") + "\\n";
  
  var blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" });
  var link = document.createElement("a");
  if (link.download !== undefined) {
    var url = URL.createObjectURL(blob);
    link.href = url;
    var fileName = memberName.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ0-9]/g, "_") + "_rapor.txt";
    link.download = fileName;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert("📄 Rapor kaydedildi: " + fileName);
  }
}

function closeModal() { 
  document.getElementById("memberModal").classList.remove("show"); 
}

function saveAllData() {
  try {
    localStorage.setItem("excel_data", JSON.stringify(allData));
    localStorage.setItem("excel_headers", JSON.stringify(headers));
    localStorage.setItem("member_notes", JSON.stringify(memberNotes));
    localStorage.setItem("member_photos", JSON.stringify(memberPhotos));
    localStorage.setItem("current_filename", currentFileName);
    alert("💾 Tüm veriler kaydedildi!");
    updateCounts();
  } catch (error) {
    console.error("Save error:", error);
    alert("❌ Kayıt hatası: " + error.message);
  }
}

function saveCurrentWork() {
  try {
    localStorage.setItem("excel_data", JSON.stringify(allData));
    localStorage.setItem("excel_headers", JSON.stringify(headers));
    localStorage.setItem("member_notes", JSON.stringify(memberNotes));
    localStorage.setItem("member_photos", JSON.stringify(memberPhotos));
    localStorage.setItem("current_filename", currentFileName);
    updateCounts();
  } catch (error) {
    console.error("Auto-save error:", error);
  }
}

function loadSavedData() {
  try {
    var savedData = localStorage.getItem("excel_data");
    var savedHeaders = localStorage.getItem("excel_headers");
    var savedNotes = localStorage.getItem("member_notes");
    var savedPhotos = localStorage.getItem("member_photos");
    var savedFileName = localStorage.getItem("current_filename");
    
    if (savedData && savedHeaders) {
      allData = JSON.parse(savedData);
      headers = JSON.parse(savedHeaders);
      filteredData = allData.slice();
      if (savedNotes) { memberNotes = JSON.parse(savedNotes); }
      if (savedPhotos) { memberPhotos = JSON.parse(savedPhotos); }
      if (savedFileName) { currentFileName = savedFileName; }
      
      displayTable();
      populateFilterOptions();
      updateCurrentFileDisplay();
      document.getElementById("dataSection").style.display = "block";
      alert("📂 Son çalışmanız yüklendi: " + allData.length + " kayıt");
    } else {
      alert("⚠️ Kaydedilmiş çalışma bulunamadı!");
    }
    updateCounts();
  } catch (error) { 
    console.error("Veri yükleme hatası:", error); 
    alert("❌ Veri yüklenirken hata oluştu!"); 
  }
}

function clearAllData() {
  if (confirm("⚠️ Tüm veriler ve kayıtlı çalışmalar silinecek. Emin misiniz?")) {
    localStorage.removeItem("excel_data");
    localStorage.removeItem("excel_headers");
    localStorage.removeItem("member_notes");
    localStorage.removeItem("member_photos");
    localStorage.removeItem("current_filename");
    allData = []; 
    headers = []; 
    filteredData = []; 
    memberNotes = {}; 
    memberPhotos = {}; 
    currentFileName = "";
    document.getElementById("dataSection").style.display = "none";
    updateCurrentFileDisplay();
    alert("🗑️ Tüm veriler temizlendi!");
    updateCounts();
  }
}

function exportData() {
  if (allData.length === 0) { 
    alert("⚠️ Dışa aktarılacak veri yok!"); 
    return; 
  }
  
  var csvContent = headers.join(",") + ",Notlar,Fotoğraf\\n";
  for (var i = 0; i < allData.length; i++) {
    var note = memberNotes[i] || "";
    var hasPhoto = memberPhotos[i] ? "Var" : "Yok";
    var rowWithNote = allData[i].slice();
    rowWithNote.push(note.replace(/[\\n\\r]/g, " ")); 
    rowWithNote.push(hasPhoto);
    
    var csvRow = "";
    for (var j = 0; j < rowWithNote.length; j++) {
      if (j > 0) csvRow += ",";
      csvRow += '"' + (rowWithNote[j] || "").replace(/"/g, '""') + '"';
    }
    csvContent += csvRow + "\\n";
  }
  
  var blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  var link = document.createElement("a");
  if (link.download !== undefined) {
    var url = URL.createObjectURL(blob);
    link.href = url;
    var exportName = currentFileName ? 
      currentFileName.replace(".csv", "_güncellenmiş.csv") : 
      "veriler_" + new Date().toISOString().split("T")[0] + ".csv";
    link.download = exportName;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert("📤 Veriler dışa aktarıldı: " + exportName);
  }
}

function checkStatus() {
  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    document.getElementById("storageStatus").textContent = "Çalışıyor";
  } catch (e) { 
    document.getElementById("storageStatus").textContent = "Hata"; 
  }
  updateCounts();
}

function updateCounts() {
  var saved = localStorage.getItem("excel_data");
  var notes = localStorage.getItem("member_notes");
  var photos = localStorage.getItem("member_photos");
  
  if (saved) {
    var data = JSON.parse(saved);
    document.getElementById("dataCount").textContent = (data.length || 0) + " kayıt";
  } else {
    document.getElementById("dataCount").textContent = "0 kayıt";
  }
  
  var noteCount = 0; 
  var photoCount = 0;
  
  if (notes) {
    var notesData = JSON.parse(notes);
    for (var key in notesData) { 
      if (notesData[key] && notesData[key].trim()) { 
        noteCount++; 
      } 
    }
  }
  
  if (photos) {
    var photosData = JSON.parse(photos);
    for (var key in photosData) { 
      if (photosData[key]) { 
        photoCount++; 
      } 
    }
  }
  
  document.getElementById("notesCount").textContent = noteCount + " not, " + photoCount + " fotoğraf";
}
</script>
</body>
</html>`;
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});