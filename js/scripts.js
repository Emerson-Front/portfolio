$('#menu-header a[data-target]').click(function (e) {
    e.preventDefault();

    let targetId = $(this).data('target');

    $(targetId)[0].scrollIntoView({ behavior: 'smooth' });
});



//Atualizar o ano automáticamente no footer

document.getElementById('ano').textContent = new Date().getFullYear();