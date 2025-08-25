from django.db import models


class Indfin(models.Model):
    solvencia = models.TextField()
    solvencia1 = models.TextField()
    razoncte = models.TextField()
    razoncte1 = models.TextField()
    pruebaacida = models.TextField()
    pruebaacida1 = models.TextField()
    captrabajo = models.TextField()
    captrabajo1 = models.TextField()
    roe = models.TextField(db_column='ROE')  # Field name made lowercase.
    roe1 = models.TextField(db_column='ROE1')  # Field name made lowercase.
    finventas = models.TextField()
    finventas1 = models.TextField()
    gearing = models.TextField()
    gearing1 = models.TextField()
    apactivosing = models.TextField()
    apactivosing1 = models.TextField()
    apactivostotal = models.TextField()
    apactivostotal1 = models.TextField()
    endfin = models.TextField()
    endfin1 = models.TextField()
    endventas = models.TextField()
    endventas1 = models.TextField()
    conccp = models.TextField(db_column='concCP')  # Field name made lowercase.
    conccp1 = models.TextField(db_column='concCP1')  # Field name made lowercase.
    deudacpventas = models.TextField(db_column='deudaCPventas')  # Field name made lowercase.
    deudacpventas1 = models.TextField(db_column='deudaCPventas1')  # Field name made lowercase.
    gastosfinutop = models.TextField()
    gastosfinutop1 = models.TextField()
    apbancario = models.TextField()
    apbancario1 = models.TextField()
    margenop = models.TextField()
    margenop1 = models.TextField()
    margenneto = models.TextField()
    margenneto1 = models.TextField()
    rotinv = models.TextField()
    rotinv1 = models.TextField()
    rotcart = models.TextField()
    rotcart1 = models.TextField()
    cicloop = models.TextField()
    cicloop1 = models.TextField()
    pagoprov = models.TextField()
    pagoprov1 = models.TextField()
    rentabop = models.TextField()
    endtotal = models.TextField()
    endtotal1 = models.TextField()

    class Meta:
        managed = False
        db_table = 'indfin'
