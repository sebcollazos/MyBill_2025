from django.db import models


class Indicadores(models.Model):
    resultadobruto = models.TextField()
    resultadobruto1 = models.TextField()
    resultadoop = models.TextField()
    resultadoop1 = models.TextField()
    resultadoantesimp = models.TextField()
    resultadoantesimp1 = models.TextField()
    resultadoej = models.TextField()
    resultadoej1 = models.TextField()

    class Meta:
        managed = False
        db_table = 'indicadores'
