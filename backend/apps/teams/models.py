from django.db import models


class Team(models.Model):
    YEAR_CHOICES = [(i, f'Year {i}') for i in range(1, 7)]

    name = models.CharField(max_length=100)
    year_group = models.IntegerField(choices=YEAR_CHOICES)
    emoji = models.CharField(max_length=10, default='⚽')
    color = models.CharField(max_length=7, default='#F5C842')
    bg_color = models.CharField(max_length=7, default='#0D2E4B')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['year_group', 'name']

    def __str__(self):
        return f"{self.name} (Year {self.year_group})"

    @property
    def stats(self):
        home_done = self.home_matches.filter(status='done')
        away_done = self.away_matches.filter(status='done')
        wins = draws = losses = gf = ga = 0

        for m in home_done:
            try:
                gf += m.home_score
                ga += m.away_score
                if m.home_score > m.away_score:
                    wins += 1
                elif m.home_score == m.away_score:
                    penalty_winner_id = getattr(m, 'penalty_winner_id', None)
                    if penalty_winner_id == self.id:
                        wins += 1
                    elif penalty_winner_id is not None:
                        losses += 1
                    else:
                        draws += 1
                else:
                    losses += 1
            except Exception:
                continue

        for m in away_done:
            try:
                gf += m.away_score
                ga += m.home_score
                if m.away_score > m.home_score:
                    wins += 1
                elif m.away_score == m.home_score:
                    penalty_winner_id = getattr(m, 'penalty_winner_id', None)
                    if penalty_winner_id == self.id:
                        wins += 1
                    elif penalty_winner_id is not None:
                        losses += 1
                    else:
                        draws += 1
                else:
                    losses += 1
            except Exception:
                continue

        played = wins + draws + losses
        return {
            'played': played,
            'wins': wins,
            'draws': draws,
            'losses': losses,
            'gf': gf,
            'ga': ga,
            'gd': gf - ga,
            'points': wins * 3 + draws,
        }


class Player(models.Model):
    POSITIONS = [
        ('GK', 'Goalkeeper'),
        ('DEF', 'Defender'),
        ('MID', 'Midfielder'),
        ('FWD', 'Forward'),
    ]

    team = models.ForeignKey(Team, related_name='players', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    jersey_number = models.IntegerField(null=True, blank=True)
    position = models.CharField(max_length=3, choices=POSITIONS)
    photo = models.ImageField(upload_to='players/', null=True, blank=True)
    is_captain = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['jersey_number', 'name']

    def __str__(self):
        return f"#{self.jersey_number} {self.name} ({self.team.name})"

    @property
    def goals(self):
        return self.match_events.filter(event_type='goal').count()

    @property
    def assists(self):
        return self.match_events.filter(event_type='assist').count()

    @property
    def yellow_cards(self):
        return self.match_events.filter(event_type='yellow_card').count()

    @property
    def red_cards(self):
        return self.match_events.filter(event_type='red_card').count()