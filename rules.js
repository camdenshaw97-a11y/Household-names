/* Household Names — the rules both the server and the screens need to agree on. */
(function (root, make) {
  if (typeof module === 'object' && module.exports) module.exports = make();
  else root.Rules = make();
})(this, function () {
  'use strict';
  var ROUNDS = [
    { n: 1, name: 'Say Anything', short: 'Use any words, sounds or gestures.',
      rules: ['Say anything you like, except the name itself.', 'You may read the description out loud.', 'No spelling it out and no "rhymes with".'] },
    { n: 2, name: 'One Word', short: 'One word only. Repeat it as often as you like.',
      rules: ['One word per card. Any word except the name.', 'You may repeat it, but you may not swap it.', 'No sounds and no gestures.'] },
    { n: 3, name: 'Charades', short: 'Act it out. No words.',
      rules: ['No words at all.', 'Sound effects are fine.', 'Point, mime, dance. Whatever works.'] },
    { n: 4, name: 'Freeze Frame', short: 'Strike one pose and hold it.',
      rules: ['Hit one pose for each card and freeze.', 'No moving and no sounds.', 'New card, new pose.'] }
  ];
  var TEAMS = [
    { id: 0, name: 'Team Tomato', color: '#E5484D', ink: '#fff' },
    { id: 1, name: 'Team Blueberry', color: '#3E63DD', ink: '#fff' },
    { id: 2, name: 'Team Mustard', color: '#F2B01E', ink: '#2A1E00' },
    { id: 3, name: 'Team Pickle', color: '#2F9E5B', ink: '#fff' }
  ];
  var CHOICES = {
    rating: ['family', 'dark'],
    cards: [30, 40, 50, 60],
    timer: [45, 60, 75, 90],
    rounds: [3, 4],
    teams: [2, 3, 4]
  };
  var LABELS = {
    rating: { family: 'Family-friendly', dark: 'After Dark' },
    cards: function (v) { return v + ' cards'; },
    timer: function (v) { return v + ' seconds'; },
    rounds: function (v) { return v === 4 ? '4 rounds (adds Freeze Frame)' : '3 rounds'; },
    teams: function (v) { return v + ' teams'; }
  };
  var DEFAULTS = { rating: 'family', cards: 40, timer: 60, rounds: 3, teams: 2 };
  var CATEGORIES = {
    PEOPLE: { label: 'Real People', color: '#E8503A' },
    CHARACTERS: { label: 'Characters', color: '#2F5BEA' },
    LEGENDS: { label: 'Myths & Legends', color: '#7B4BD6' },
    ANIMALS: { label: 'Animals', color: '#1B9E77' },
    PLACES: { label: 'Places', color: '#0E93B8' },
    THINGS: { label: 'Things', color: '#C98A00' },
    MOMENTS: { label: 'Moments', color: '#E0457B' },
    FOLKS: { label: 'Types of People', color: '#D9681C' }
  };
  function label(key, v) { var l = LABELS[key]; return typeof l === 'function' ? l(v) : (l[v] || String(v)); }
  return { ROUNDS: ROUNDS, TEAMS: TEAMS, CHOICES: CHOICES, DEFAULTS: DEFAULTS, CATEGORIES: CATEGORIES, label: label, MAX_PLAYERS: 20, MIN_TEAM: 2 };
});
