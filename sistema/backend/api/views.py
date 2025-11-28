from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Usuario, Produto, Movimentacao
from .serializers import UsuarioSerializer, ProdutoSerializer, MovimentacaoSerializer

# [cite_start]CRUD de Produtos [cite: 63]
class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

# Histórico de Movimentações (Listagem)
class MovimentacaoViewSet(viewsets.ModelViewSet):
    queryset = Movimentacao.objects.all().order_by('-data_movimentacao')
    serializer_class = MovimentacaoSerializer

# [cite_start]Login Manual [cite: 53]
@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    senha = request.data.get('senha')
    try:
        user = Usuario.objects.get(email=email, senha=senha)
        return Response({'id': user.id, 'nome': user.nome, 'email': user.email}, status=200)
    except Usuario.DoesNotExist:
        return Response({'erro': 'Credenciais inválidas'}, status=401)

# [cite_start]Lógica de Estoque + Alerta [cite: 84]
@api_view(['POST'])
def registrar_movimentacao(request):
    try:
        prod_id = request.data.get('produto_id')
        user_id = request.data.get('usuario_id')
        tipo = request.data.get('tipo')
        qtd = int(request.data.get('quantidade'))

        produto = Produto.objects.get(id=prod_id)

        if tipo == 'saida':
            if produto.quantidade_estoque < qtd:
                return Response({'erro': 'Estoque insuficiente'}, status=400)
            produto.quantidade_estoque -= qtd
        else:
            produto.quantidade_estoque += qtd
        
        produto.save()

        # Registra histórico
        Movimentacao.objects.create(produto_id=prod_id, usuario_id=user_id, tipo=tipo, quantidade=qtd)

        # Verifica alerta de estoque mínimo
        alerta = produto.quantidade_estoque < produto.estoque_minimo

        return Response({'sucesso': True, 'novo_estoque': produto.quantidade_estoque, 'alerta': alerta}, status=201)

    except Exception as e:
        return Response({'erro': str(e)}, status=500)