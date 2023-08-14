google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(run);

const sheetId = "18TIqNuXrJYzDRKfBXrnYuc4xvLo2K_v6dqYLkZZCJqI"; // 구글 시트 ID
const apiKey = "AIzaSyBGVBkEXJc3KkCsBDCmusiAhY8PEUbpNhI"; // 구글 API 키
const sheetDataRange = "Sheet3!A1:B99";

const sheetInfo = [
  {
    chartElementId: "chartContainer1",
    dataRange: "Sheet1!A1:B14", // 시트1의 데이터 범위
    chartType: "bar",
    options: {
      width: 800,
      height: 600,
      legend: { position: "bottom" },
      hAxis: { title: "지역" },
    },
  },
  {
    chartElementId: "chartContainer2",
    dataRange: "Sheet2!A1:B5", // 시트2의 데이터 범위
    chartType: "pie",
    options: {
      width: 800,
      height: 600,
      legend: { position: "bottom" },
      hAxis: { title: "항목" },
    },
  },
  {
    chartElementId: "chartContainer3",
    dataRange: "Sheet3!A1:B999",
    chartType: "bar", // 원하는 차트 유형: line, bar 등
    options: {
      title: "시트3 차트 제목",
      width: 800,
      height: 600,
      legend: { position: "bottom" },
      hAxis: { title: "항목" },
      vAxis: { title: "값" },
    },
    sortOrder: "desc", // 추가한 'sortOrder' 속성
  },

  // 이하, 시트 별로 차트에 대한 설정 정보 위의 형식으로 추가
];

async function fetchData(sheetId, dataRange, apiKey) {
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${dataRange}?key=${apiKey}`
  );

  if (!response.ok) {
    console.error("서버로부터 에러 메시지를 받았습니다:", response.status);
    return null;
  }
  
  const responseData = await response.json();
  return responseData.values;
}

async function drawChart(sheetInfo) {
  const data = await fetchData(sheetId, sheetInfo.dataRange, apiKey);
  if (!data) {
    console.error("데이터가 로드되지 않았습니다.");
    return;
  }
  
  const headers = data.shift();
  
  const processedData = data.map(row =>
    row.map(val => {
      const numberValue = parseFloat(val);
      return isNaN(numberValue) ? val : numberValue;
    })
  );

  const dataTable = new google.visualization.DataTable();
  dataTable.addColumn("string", headers[0]);

  for (let i = 1; i < headers.length; i++) {
    dataTable.addColumn("number", headers[i]);
  }

  dataTable.addRows(processedData);

  let chart;
  switch (sheetInfo.chartType) {
    case "line":
      chart = new google.visualization.LineChart(document.getElementById(sheetInfo.chartElementId));
      break;
    case "bar":
      chart = new google.visualization.BarChart(document.getElementById(sheetInfo.chartElementId));
      break;
    case "pie":
      chart = new google.visualization.PieChart(document.getElementById(sheetInfo.chartElementId));
      break;
    default:
      console.error("지원되지 않는 차트 타입입니다.");
      return;
  }

  chart.draw(dataTable, sheetInfo.options);
}

async function run() {
  for (const info of sheetInfo) {
    drawChart(info);
  }
}

// 데이터를 출력하는 함수 정의
async function showDataList() {
    const data = await fetchData(sheetId, sheetDataRange, apiKey);
    const listContainer = document.getElementById("sheetDataList");
  
    data.forEach((row) => {
      const listItem = document.createElement("li");
      listItem.textContent = row.join("");
      listContainer.appendChild(listItem);
    });
  }
  
  // 코드 실행
  showDataList();
  