
/***** 팝업 *****/
// 성공 팝업 함수
function showSuccessPopup() {
    Swal.fire({
    icon: 'success',
    title: '성공!',
    text: '데이터가 정상적으로 저장되었습니다.',
    confirmButtonText: '확인'
    });
}
// 에러 팝업 함수 (필요할 때 사용)
function showErrorPopup(message) {
    Swal.fire({
    icon: 'error',
    title: '오류 발생',
    text: message || '처리 중 문제가 발생했습니다.',
    confirmButtonText: '닫기'
    });
}
// 확인 팝업 함수
async function showConfirmPopup(message) {
  const result = await Swal.fire({
    icon: 'question',
    title: '확인 필요',
    text: message || '계속 진행하시겠습니까?',
    showCancelButton: true,
    confirmButtonText: '확인',
    cancelButtonText: '취소'
  });
  return result.isConfirmed; // true/false 반환
}
