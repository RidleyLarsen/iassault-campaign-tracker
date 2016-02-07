var auth = ref.getAuth();

if (auth !== null) {
  var userRef = ref.child(auth.uid);
}

function get_campaign(id) {
  var template = Handlebars.compile($('#campaign-template').html());
  $('.content').addClass('content-hidden');
  $('.campaign').removeClass('campaign-hidden');
  $('.campaign').html($(template(campaigns[id])));
  current_campaign_id = id;
}
var current_campaign_id;
var campaigns = {};
var body_content;
var auth = ref.getAuth();
if (auth !== null && auth !== undefined) {
  var userRef = ref.child(auth.uid);
  var campaignRef = userRef.child('campaigns');
  campaignRef.on('child_added', function (childSnapshot, prevChildKey) {
    data = childSnapshot.val();
    data.key = childSnapshot.key();
    campaigns[data.key] = data;
    var template = Handlebars.compile($('#campaign-row-template').html());
    $('table.campaigns tbody').append($(template(data)));
  });
  campaignRef.on('child_removed', function (childSnapshot, prevChildKey) {
    key = childSnapshot.key();
    $('tr[data-fbkey="' + data.key + '"]').remove();
  });
  campaignRef.on('child_changed', function (childSnapshot, prevChildKey) {
    data = childSnapshot.val();
    data.key = childSnapshot.key();
    campaigns[data.key] = data;
    if (!$('.campaign').hasClass('campaign-hidden')) {
      get_campaign(data.key);
    }
  });
}

$(function () {
  $('.add-campaign').on('click', function () {
    $('.modal').modal();
  });

  $(document).on('click', '.campaign-player-add', function (e) {
    $('.campaign-players tbody').append($('#campaign-add-player-template').html());
    if (campaigns[current_campaign_id].players === undefined) {
      campaigns[current_campaign_id].players = [];
    }
    campaigns[current_campaign_id].players.push({});
  });

  $('#add-campaign-modal').on('click', function () {
    campaign = {};
    campaign.name = $('#id_name').val();
    campaign.date = $('#id_date').val();
    players = [];
    $('.player-form').each(function (elt) {
      if ($(this).find('.player-name').val() === "") {
        return;
      }
      players.push({
        'name': $(this).find('.player-name').val(),
        'character': $(this).find('.character-name').val()
      });
    });
    campaign.players = players;
    campaign.missions = [];
    campaignRef.push(campaign);
    toastr['success']("You added " + campaign.name + ".");
    $('.player-form').remove();
    $('.modal input').val('');
    $('.modal').modal('hide');
  });
  $(document).on('click', '.campaign-row', function () {
    get_campaign($(this).attr('data-fbkey'));
  });
  $(document).on('click', '.btn-back-to-campaigns', function () {
    $('.campaign').addClass('campaign-hidden');
    $('.content').removeClass('content-hidden');
  });
  $(document).on('click', '.remove-campaign', function (e) {
    e.stopPropagation();
    var key = $(this).parents('tr').attr('data-fbkey');
    var thisCampaignRef = campaignRef.child(key);
    thisCampaignRef.remove();
    $(this).parents('tr').remove();
  });

  $(document).on('click', '.campaign-player-edit', function () {
    $('.campaign-players td input').removeClass('hidden');
    $('.campaign-players td span').addClass('hidden');
    $(this).removeClass('btn-primary').addClass('btn-success');
    $(this).find('span').text('Save Players');
    $(this).find('i').removeClass('fa-pencil').addClass('fa-save');
    $(this).removeClass('campaign-player-edit').addClass('campaign-player-save');
    $('.campaign-player-delete').removeClass('hidden');
    $('.campaign-player-add').removeClass('hidden');
  });

  $(document).on('click', '.campaign-player-delete', function () {
    console.log($(this).parents('tr'));
    console.log($(this).parents('tr').index());
    campaigns[current_campaign_id].players.splice($(this).parents('tr').index(), 1);
    $(this).parents('tr').remove();
  });

  $(document).on('click', '.campaign-player-save', function () {
    $('.campaign-players .player').each(function (i) {
      var player_index = i;
      var name = $(this).find('input[name="name"]');
      $(this).find('input').each(function (j) {
        campaigns[current_campaign_id].players[player_index][$(this).attr('name')] = $(this).val();
        $(this).parent().find('span').text($(this).val());
      });
    });
    $('.campaign-players td span').removeClass('hidden');
    $('.campaign-players td input').addClass('hidden');
    $(this).removeClass('btn-success').addClass('btn-primary');
    $(this).find('span').text('Edit Players');
    $(this).find('i').removeClass('fa-save').addClass('fa-pencil');
    $(this).removeClass('campaign-player-save').addClass('campaign-player-edit');
    $('.campaign-player-delete').addClass('hidden');
    $('.campaign-player-add').addClass('hidden');

    var thisCampaignRef = campaignRef.child(current_campaign_id);
    thisCampaignRef.set(campaigns[current_campaign_id]);
    toastr["success"]("Characters updated successfully.")
  });
});
