import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.dev')
django.setup()

from django.contrib.auth.models import User
from apps.teams.models import Team, Player
from apps.matches.models import Match, MatchEvent
from apps.news.models import NewsPost

print("🌱 Seeding database...")

# ── TEAMS ──────────────────────────────────────────────
teams_data = [
    ('Eagles',  1, '🦅', '#4A9FD4', '#0D2E4B'),
    ('Wolves',  2, '🐺', '#9B59B6', '#2E1A3B'),
    ('Eagles',  3, '🦅', '#4CAF50', '#1A2E0D'),
    ('Tigers',  4, '🐯', '#E67E22', '#2E1A0D'),
    ('Lions',   5, '🦁', '#F1C40F', '#2E2A0D'),
    ('Phoenix', 6, '🦜', '#E74C3C', '#2E0D0D'),
]

teams = []
for name, year, emoji, color, bg in teams_data:
    team, created = Team.objects.get_or_create(
        name=name,
        year_group=year,
        defaults={'emoji': emoji, 'color': color, 'bg_color': bg}
    )
    teams.append(team)
    print(f"  ✅ Team: {team}")

# ── PLAYERS ────────────────────────────────────────────
players_data = [
    # (team_index, name, number, position, is_captain)
    (0, 'Keza M.',    1,  'GK',  False),
    (0, 'Hiroshi M.', 2,  'DEF', False),
    (0, 'Amara K.',   3,  'DEF', False),
    (0, 'Luc B.',     4,  'MID', True),
    (0, 'Kwame A.',   9,  'FWD', False),
    (0, 'Remi T.',    11, 'FWD', False),

    (1, 'Sven L.',    1,  'GK',  False),
    (1, 'Carlos R.',  5,  'MID', True),
    (1, 'Diego F.',   8,  'MID', False),
    (1, 'Marco T.',   9,  'FWD', False),
    (1, 'Ana P.',     10, 'FWD', False),

    (2, 'Omar B.',    1,  'GK',  False),
    (2, 'Fatima N.',  4,  'MID', True),
    (2, 'Yusuf A.',   7,  'FWD', False),
    (2, 'Chen W.',    9,  'FWD', False),
    (2, 'Diallo S.',  11, 'FWD', False),

    (3, 'Ivan P.',    1,  'GK',  False),
    (3, 'Mia S.',     3,  'DEF', False),
    (3, 'Tom H.',     6,  'MID', True),
    (3, 'Elena V.',   8,  'MID', False),
    (3, 'Max B.',     10, 'FWD', False),

    (4, 'Julia K.',   1,  'GK',  False),
    (4, 'Kofi A.',    5,  'MID', True),
    (4, 'Aisha M.',   7,  'FWD', False),
    (4, 'Bruno S.',   9,  'FWD', False),
    (4, 'Nadia L.',   11, 'FWD', False),

    (5, 'Felix R.',   1,  'GK',  False),
    (5, 'Zara K.',    4,  'MID', True),
    (5, 'Leo P.',     8,  'MID', False),
    (5, 'Sara T.',    9,  'FWD', False),
    (5, 'Nico B.',    11, 'FWD', False),
]

players = []
for team_idx, name, number, pos, captain in players_data:
    player, created = Player.objects.get_or_create(
        team=teams[team_idx],
        name=name,
        defaults={
            'jersey_number': number,
            'position': pos,
            'is_captain': captain,
        }
    )
    players.append(player)
    print(f"  ✅ Player: {player}")

# ── MATCHES ────────────────────────────────────────────
now = timezone.now()

matches_data = [
    # (home_idx, away_idx, home_score, away_score, status, matchday, days_ago)
    (0, 1, 3, 1, 'done',      1, 14),
    (2, 3, 2, 2, 'done',      1, 14),
    (4, 5, 1, 0, 'done',      1, 14),
    (1, 2, 1, 2, 'done',      2, 10),
    (3, 0, 0, 2, 'done',      2, 10),
    (5, 4, 1, 3, 'done',      2, 10),
    (0, 2, 2, 1, 'done',      3, 6),
    (1, 3, 0, 1, 'done',      3, 6),
    (4, 5, 2, 0, 'done',      3, 6),
    (2, 0, 2, 1, 'live',      4, 0),
    (1, 4, 0, 0, 'scheduled', 4, -1),
    (3, 5, 0, 0, 'scheduled', 4, -2),
]

match_objects = []
for hi, ai, hs, as_, status, md, days_ago in matches_data:
    match_date = now - timedelta(days=days_ago)
    match, created = Match.objects.get_or_create(
        home_team=teams[hi],
        away_team=teams[ai],
        matchday=md,
        defaults={
            'home_score': hs,
            'away_score': as_,
            'status': status,
            'match_date': match_date,
            'minute': 67 if status == 'live' else None,
        }
    )
    match_objects.append(match)
    print(f"  ✅ Match: {match}")

# ── MATCH EVENTS ───────────────────────────────────────
# First match: Eagles Y1 3-1 Wolves Y2
m1 = match_objects[0]
events_m1 = [
    (players[4],  'goal',        23),  # Kwame A. goal
    (players[3],  'assist',      23),  # Luc B. assist
    (players[4],  'goal',        45),  # Kwame A. goal
    (players[9],  'goal',        58),  # Marco T. goal for Wolves
    (players[5],  'goal',        78),  # Remi T. goal
    (players[3],  'assist',      78),  # Luc B. assist
]
for player, etype, minute in events_m1:
    MatchEvent.objects.get_or_create(
        match=m1, player=player, event_type=etype, minute=minute
    )

# Live match: Eagles Y3 2-1 Eagles Y1
m_live = match_objects[9]
events_live = [
    (players[14], 'goal',        23),  # Chen W. goal
    (players[13], 'assist',      23),  # Yusuf A. assist
    (players[4],  'goal',        51),  # Kwame A. equalizer
    (players[14], 'goal',        67),  # Chen W. winner
    (players[7],  'yellow_card', 63),  # Carlos R. yellow
]
for player, etype, minute in events_live:
    MatchEvent.objects.get_or_create(
        match=m_live, player=player, event_type=etype, minute=minute
    )

print("  ✅ Match events seeded")

# ── NEWS ───────────────────────────────────────────────
admin_user = User.objects.filter(is_superuser=True).first()

news_data = [
    (
        'Eagles Y1 Crush Wolves 3-1 in Matchday 1 Opener',
        'match_report', '⚽', '#0D2E4B',
        'Kwame A. scored a brace as Eagles Y1 dominated Wolves Y2 in a thrilling opener.',
        'Full match report: Eagles started strong with Kwame opening the scoring in the 23rd minute...'
    ),
    (
        'Matchday 4 Fixtures Confirmed — Live Match Today!',
        'announcement', '🏆', '#1A2810',
        'The Matchday 4 schedule is set with a live match already underway on Campus Ground A.',
        'Matchday 4 is here. Eagles Y3 vs Eagles Y1 is currently live...'
    ),
    (
        'Kwame A. — The Striker Taking the League by Storm',
        'player_spotlight', '⭐', '#1A2830',
        'Year 1 forward Kwame A. leads the golden boot race with 5 goals in 3 matches.',
        'At just Year 1, Kwame has shown remarkable composure in front of goal...'
    ),
    (
        'Midseason Stats: Goals, Cards & Surprise Performers',
        'stats', '📊', '#2E1A0D',
        'We break down the numbers from the first three matchdays of the ASOME Champions League.',
        'After three full matchdays, here are the standout statistics...'
    ),
    (
        'Campus Ground A Gets New Goalposts for the Tournament',
        'announcement', '🏟️', '#0D2E4B',
        'The main pitch has been upgraded ahead of the knockout stage with brand new equipment.',
        'Students and players will be pleased to know that Campus Ground A has been upgraded...'
    ),
]

for title, tag, emoji, bg, excerpt, content in news_data:
    post, created = NewsPost.objects.get_or_create(
        title=title,
        defaults={
            'tag': tag,
            'emoji': emoji,
            'bg_color': bg,
            'excerpt': excerpt,
            'content': content,
            'author': admin_user,
        }
    )
    print(f"  ✅ News: {post}")

print()
print("✅ Database seeded successfully!")
print("─────────────────────────────────")
print(f"  Teams:   {Team.objects.count()}")
print(f"  Players: {Player.objects.count()}")
print(f"  Matches: {Match.objects.count()}")
print(f"  News:    {NewsPost.objects.count()}")
print("─────────────────────────────────")
print("  Admin login → http://127.0.0.1:8000/admin")
print("  Username: admin")
print("  Password: admin123")