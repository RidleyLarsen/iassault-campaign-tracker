var ref = new Firebase(FIREBASE_URL),
  queue = ref.child('queue'),
  template = Handlebars.compile($('#queue-item-template').html());

queue.on('child_added', function(snapshot) {
  var data = snapshot.val();
  data['id'] = snapshot.key();

  if (!data.done) {
    $('#table-queue').append(
      $(template(data))
    );
    $('#empty').hide();
  }
});

queue.on('child_removed', function(snapshot) {
  var data = snapshot.val();
  $('#' + snapshot.key());
});

$(function() {
  $(document).on('click', '.done', function(e) {
    e.preventDefault();

    queue.child($(this).parents('tr').attr('id')).update({
      done: true,
    });

    $(this).parents('tr').remove();

    if ($('td').length === 0) {
      $('#empty').show();
    }

    $.get('http://queue.btlr.xyz:3000/hook');
  });

  $('#submit').on('click', function(e) {
    e.preventDefault();

    if (!$(this).hasClass('disabled')) {
      if ($('#id_name').val()) {
        data = {
          name: $('#id_name').val(),
          project: $('#id_project').val(),
          link: $('#id_link').val(),
          done: false,
        };

        queue.push(data);

        $(this).addClass('disabled');
        $in = $('input');

        $in.each(
          function(i) {
            $($in[i]).attr('disabled', true);
          }
        );

        $('#id_name').parents('.form-group').removeClass('has-error');
        $(this).removeClass('btn-primary').addClass('btn-success');
        $(this).text("You're in the queue.");
        $(this).blur();
      } else {
        $('#id_name').parents('.form-group').addClass('has-error');
        $('#id_name').focus();
      }
    }
  });
});
