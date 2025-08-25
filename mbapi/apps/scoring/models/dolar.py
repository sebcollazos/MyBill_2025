from django.db import models


class Dolar(models.Model):
    fecha = models.DateField()
    valor = models.FloatField()

    class Meta:
        managed = False
        db_table = 'dolar'
