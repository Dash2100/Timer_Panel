function validateInput(input) {
    if (parseInt(input.value) > 59) {
        input.value = '59';
    }
    if (input.value.length === 1) {
        input.value = '0' + input.value;
    }
    input.value = input.value.replace(/[^0-9]/g, '');
}

//setip function Swal.fire with input box to set ip adress
function setip() {
    Swal.fire({
        title: 'Enter IP address',
        input: 'text',
        inputAttributes: {
            autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Set',
        showLoaderOnConfirm: true,
        preConfirm: (ip) => {
            // return fetch(`//${ip}:8080/setip`)
            //     .then(response => {
            //         if (!response.ok) {
            //             throw new Error(response.statusText)
            //         }
            //         return response.json()
            //     })
            //     .catch(error => {
            //         Swal.showValidationMessage(
            //             `Request failed: ${error}`
            //         )
            //     })
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.value) {
            Swal.fire({
                title: `${result.value.message}`
            })
        }
    })
}
