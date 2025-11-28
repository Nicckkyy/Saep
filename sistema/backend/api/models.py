from django.db import models

class Usuario(models.Model):
    nome = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    senha = models.CharField(max_length=255)

    class Meta:
        db_table = 'usuarios'

class Produto(models.Model):
    nome = models.CharField(max_length=100)
    descricao = models.TextField(null=True, blank=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    quantidade_estoque = models.IntegerField(default=0)
    estoque_minimo = models.IntegerField(default=5)
    class Meta:
        db_table = 'produtos'

class Movimentacao(models.Model):
    TIPO_CHOICES = [('entrada', 'Entrada'), ('saida', 'Saída')]
    
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE)
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    quantidade = models.IntegerField()
    data_movimentacao = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'movimentacoes'