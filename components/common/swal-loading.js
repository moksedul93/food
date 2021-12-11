import Swal from "sweetalert2";

const SwalLoading = props => {
    Swal.fire({
        title: 'Wait ...',
        onBeforeOpen () {
            Swal.showLoading ()
        },
        onAfterClose () {
            Swal.hideLoading()
        },
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false
    });
}

export {SwalLoading}