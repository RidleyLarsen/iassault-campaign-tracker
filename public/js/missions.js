$(function () {
  $(document).on('click', '.mission-add', function (e) {
    $('.missions tbody').append($('#add-mission-template').html());
    if (campaigns[current_campaign_id].missions === undefined) {
      campaigns[current_campaign_id].missions = [];
    }
    campaigns[current_campaign_id].missions.push({});
  });

  $(document).on('click', '.remove-mission', function (e) {
    e.stopPropagation();
    var key = $(this).parents('tr').attr('data-fbkey');
    var thisCampaignRef = campaignRef.child(key);
    thisCampaignRef.remove();
    $(this).parents('tr').remove();
  });

  $(document).on('click', '.mission-edit', function () {
    $('.mission td input').removeClass('hidden');
    $('.mission td span').addClass('hidden');
    $(this).removeClass('btn-primary').addClass('btn-success');
    $(this).find('span').text('Save Missions');
    $(this).find('i').removeClass('fa-pencil').addClass('fa-save');
    $(this).removeClass('mission-edit').addClass('mission-save');
    $('.mission-add').removeClass('hidden');
    $('.mission-delete').removeClass('hidden');
  });

  $(document).on('click', '.mission-delete', function () {
    campaigns[current_campaign_id].missions.splice($(this).parents('tr').index(), 1);
    $(this).parents('tr').remove();
  });

  $(document).on('click', '.mission-save', function () {
    $('.missions .mission').each(function (i) {
      var mission_index = i;
      var name = $(this).find('input[name="name"]');
      $(this).find('input').each(function (j) {
        campaigns[current_campaign_id].missions[mission_index][$(this).attr('name')] = $(this).val();
        $(this).parent().find('span').text($(this).val());
      });
    });
    $('.missions td span').removeClass('hidden');
    $('.missions td input').addClass('hidden');
    $(this).removeClass('btn-success').addClass('btn-primary');
    $(this).find('span').text('Edit Missions');
    $(this).find('i').removeClass('fa-save').addClass('fa-pencil');
    $(this).removeClass('mission-save').addClass('mission-edit');
    $('.mission-add').addClass('hidden');
    $('.mission-delete').addClass('hidden');

    var thisCampaignRef = campaignRef.child(current_campaign_id);
    thisCampaignRef.set(campaigns[current_campaign_id]);
    toastr["success"](campaigns[current_campaign_id].name + ": Missions updated successfully.");
  });
});
