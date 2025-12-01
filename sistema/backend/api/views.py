from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate # Importante para usar o login padrão
from .models import Usuario, Produto, Movimentacao
from .serializers import UsuarioSerializer, ProdutoSerializer, MovimentacaoSerializer

# CRUD de Produtos
class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

# Histórico de Movimentações (Listagem)
class MovimentacaoViewSet(viewsets.ModelViewSet):
    queryset = Movimentacao.objects.all().order_by('-data_movimentacao')
    serializer_class = MovimentacaoSerializer

# --- LOGIN COM SUPERUSUÁRIO (DJANGO AUTH) ---
@api_view(['POST'])
@permission_classes([AllowAny]) 
def login_view(request):
    # O Django Auth padrão usa 'username' e 'password'
    username = request.data.get('username') 
    password = request.data.get('password')

    # authenticate verifica na tabela padrão 'auth_user' (onde fica o superuser)
    user = authenticate(username=username, password=password)

    if user is not None:
        # Gera o token JWT para esse usuário oficial do Django
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'id': user.id,     
            'nome': user.username  
        }, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Usuário ou senha inválidos'}, status=status.HTTP_401_UNAUTHORIZED)

# Lógica de Estoque + Alerta
@api_view(['POST'])
def registrar_movimentacao(request):
    try:
        prod_id = request.data.get('produto') 
        user_id = request.data.get('usuario') # ID do usuário logado
        tipo = request.data.get('tipo')
        qtd = int(request.data.get('quantidade'))
        
        try:
            produto = Produto.objects.get(id=prod_id)
        except Produto.DoesNotExist:
            return Response({'erro': 'Produto não encontrado'}, status=404)

        if tipo == 'saida':
            if produto.quantidade_estoque < qtd:
                return Response({'erro': 'Estoque insuficiente para esta saída.'}, status=400)
            produto.quantidade_estoque -= qtd
        elif tipo == 'entrada':
            produto.quantidade_estoque += qtd
        
        produto.save()

        # Nota: Se você for usar o User padrão do Django para tudo, 
        # futuramente precisará ajustar o models.py de Movimentacao para apontar para User do Django.
        # Por enquanto, mantive a lógica, mas garanta que o ID passado exista.
        movimentacao = Movimentacao.objects.create(
            produto_id=prod_id, 
            usuario_id=user_id, # Cuidado: aqui ele espera um ID da tabela 'usuarios' customizada se não alterarmos o model
            tipo=tipo, 
            quantidade=qtd
        )

        alerta = produto.quantidade_estoque < produto.estoque_minimo

        return Response({
            'sucesso': True, 
            'novo_estoque': produto.quantidade_estoque, 
            'alerta_estoque_baixo': alerta
        }, status=201)

    except Exception as e:
        return Response({'erro': f'Erro interno: {str(e)}'}, status=500)