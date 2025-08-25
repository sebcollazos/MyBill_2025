from django.db import models


class Cuentas(models.Model):
    variable = models.TextField()
    indicador = models.TextField()
    tipo = models.TextField()

    class Meta:
        managed = False
        db_table = 'cuentas'
