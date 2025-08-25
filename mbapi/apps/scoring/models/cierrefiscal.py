from django.db import models


class Cierrefiscal(models.Model):
    pais = models.TextField()
    fecha = models.TextField()

    class Meta:
        managed = False
        db_table = 'cierrefiscal'
