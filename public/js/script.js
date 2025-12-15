

/***** API 기본경로 *****/
const apiBase =
    (window.location.hostname === '' || window.location.hostname.includes('localhost'))
    ? 'http://localhost:3000/api/farms'
    : 'https://webapp-databricks-dashboard-c7a3fjgmb7d3dnhn.koreacentral-01.azurewebsites.net/api/farms';

    
/***** 날짜를 yyyy-mm-dd로 포맷 *****/
function toDateInputValue(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d)) return '';
    return d.toISOString().slice(0, 10);
}




