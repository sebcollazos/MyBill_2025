from django.db import models


class Empresas(models.Model):
    nit = models.TextField(db_column='NIT')  # Field name made lowercase.
    pyme = models.IntegerField()
    ind_sep = models.IntegerField(db_column='ind-sep')  # Field renamed to remove unsuitable characters.
    nombre = models.TextField()
    ciiu = models.TextField(db_column='CIIU')  # Field name made lowercase.
    constitucion = models.TextField()
    estado = models.TextField()
    direccionjud = models.TextField()
    deptojud = models.TextField()
    ciudadjud = models.TextField()
    direccion = models.TextField()
    depto = models.TextField()
    ciudad = models.TextField()
    pais = models.TextField()
    telefono = models.TextField()
    celular = models.TextField()
    email = models.TextField()
    matricula = models.TextField()
    dommatriz = models.TextField()
    paismatriz = models.TextField()
    revisor = models.TextField()
    conceptorev = models.TextField()

    class Meta:
        managed = False
        db_table = 'empresas'
