from django.db import models


class Ciiu(models.Model):
    ciiu = models.TextField(db_column='CIIU')  # Field name made lowercase.
    sector = models.TextField()
    bloqueado = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'CIIU'
