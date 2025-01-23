# Generated by Django 5.0.1 on 2025-01-22 21:41

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Game",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("ACTIVE", "Active"),
                            ("PLAYER_WON", "Player Won"),
                            ("DEALER_WON", "Dealer Won"),
                            ("TIE", "Tie"),
                        ],
                        default="ACTIVE",
                        max_length=10,
                    ),
                ),
                ("player_cards", models.JSONField(default=list)),
                ("dealer_cards", models.JSONField(default=list)),
                ("deck", models.JSONField(default=list)),
                ("player_score", models.IntegerField(default=0)),
                ("dealer_score", models.IntegerField(default=0)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "db_table": "game",
            },
        ),
    ]
