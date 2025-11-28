from rest_framework import serializers
from .models import Usuario, Produto, Movimentacao

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'

class MovimentacaoSerializer(serializers.ModelSerializer):
    produto_nome = serializers.CharField(source='produto.nome', read_only=True)
    usuario_nome = serializers.CharField(source='usuario.nome', read_only=True)

    class Meta:
        model = Movimentacao
        fields = ['id', 'produto', 'usuario', 'tipo', 'quantidade', 'data_movimentacao', 'produto_nome', 'usuario_nome']