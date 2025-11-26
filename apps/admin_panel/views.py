"""
MiniLab - Custom Admin Panel Views
İçerik yönetimi için özel görünümler.
"""
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages
from django.core.paginator import Paginator
from apps.experiments.models import Category, Experiment, LearningCard
from apps.accounts.models import User


def is_staff(user):
    """Staff yetkisi kontrolü."""
    return user.is_staff or user.is_superuser


@login_required
@user_passes_test(is_staff)
def dashboard(request):
    """Admin panel ana sayfa."""
    stats = {
        'categories': Category.objects.filter(is_active=True).count(),
        'experiments': Experiment.objects.filter(is_active=True).count(),
        'learning_cards': LearningCard.objects.count(),
        'users': User.objects.count(),
    }

    recent_experiments = Experiment.objects.select_related('category').order_by('-created_at')[:5]
    recent_cards = LearningCard.objects.select_related('experiment', 'experiment__category').order_by('-id')[:5]

    context = {
        'active_menu': 'dashboard',
        'stats': stats,
        'recent_experiments': recent_experiments,
        'recent_cards': recent_cards,
    }
    return render(request, 'admin_panel/dashboard.html', context)


@login_required
@user_passes_test(is_staff)
def categories(request):
    """Kategori listesi."""
    categories_list = Category.objects.all().order_by('order')

    context = {
        'active_menu': 'categories',
        'categories': categories_list,
    }
    return render(request, 'admin_panel/categories.html', context)


@login_required
@user_passes_test(is_staff)
def add_category(request):
    """Yeni kategori ekle."""
    if request.method == 'POST':
        name = request.POST.get('name')
        slug = request.POST.get('slug')
        icon = request.POST.get('icon', '📁')
        color = request.POST.get('color', 'blue')
        description = request.POST.get('description', '')
        order = request.POST.get('order', 0)

        Category.objects.create(
            name=name,
            slug=slug,
            icon=icon,
            color=color,
            description=description,
            order=order,
            is_active=True
        )
        messages.success(request, f'"{name}" kategorisi başarıyla eklendi!')
        return redirect('admin_panel:categories')

    context = {
        'active_menu': 'categories',
    }
    return render(request, 'admin_panel/category_form.html', context)


@login_required
@user_passes_test(is_staff)
def edit_category(request, pk):
    """Kategori düzenle."""
    category = get_object_or_404(Category, pk=pk)

    if request.method == 'POST':
        category.name = request.POST.get('name')
        category.slug = request.POST.get('slug')
        category.icon = request.POST.get('icon', '📁')
        category.color = request.POST.get('color', 'blue')
        category.description = request.POST.get('description', '')
        category.order = request.POST.get('order', 0)
        category.is_active = request.POST.get('is_active') == 'on'
        category.save()

        messages.success(request, f'"{category.name}" kategorisi güncellendi!')
        return redirect('admin_panel:categories')

    context = {
        'active_menu': 'categories',
        'category': category,
    }
    return render(request, 'admin_panel/category_form.html', context)


@login_required
@user_passes_test(is_staff)
def experiments(request):
    """Deney listesi."""
    experiments_list = Experiment.objects.select_related('category').order_by('-created_at')
    categories_list = Category.objects.filter(is_active=True)

    # Kategori filtresi
    category_id = request.GET.get('category')
    if category_id:
        experiments_list = experiments_list.filter(category_id=category_id)

    paginator = Paginator(experiments_list, 20)
    page = request.GET.get('page')
    experiments_page = paginator.get_page(page)

    context = {
        'active_menu': 'experiments',
        'experiments': experiments_page,
        'categories': categories_list,
    }
    return render(request, 'admin_panel/experiments.html', context)


@login_required
@user_passes_test(is_staff)
def add_experiment(request):
    """Yeni deney ekle."""
    if request.method == 'POST':
        category_id = request.POST.get('category')
        title = request.POST.get('title')
        slug = request.POST.get('slug')
        description = request.POST.get('description', '')
        difficulty = request.POST.get('difficulty', 'easy')
        points = request.POST.get('points', 10)

        Experiment.objects.create(
            category_id=category_id,
            title=title,
            slug=slug,
            description=description,
            difficulty=difficulty,
            points=points,
            is_active=True
        )
        messages.success(request, f'"{title}" deneyi başarıyla eklendi!')
        return redirect('admin_panel:experiments')

    context = {
        'active_menu': 'experiments',
        'categories': Category.objects.filter(is_active=True),
    }
    return render(request, 'admin_panel/experiment_form.html', context)


@login_required
@user_passes_test(is_staff)
def edit_experiment(request, pk):
    """Deney düzenle."""
    experiment = get_object_or_404(Experiment, pk=pk)

    if request.method == 'POST':
        experiment.category_id = request.POST.get('category')
        experiment.title = request.POST.get('title')
        experiment.slug = request.POST.get('slug')
        experiment.description = request.POST.get('description', '')
        experiment.difficulty = request.POST.get('difficulty', 'easy')
        experiment.points = request.POST.get('points', 10)
        experiment.is_active = request.POST.get('is_active') == 'on'
        experiment.save()

        messages.success(request, f'"{experiment.title}" deneyi güncellendi!')
        return redirect('admin_panel:experiments')

    context = {
        'active_menu': 'experiments',
        'experiment': experiment,
        'categories': Category.objects.filter(is_active=True),
    }
    return render(request, 'admin_panel/experiment_form.html', context)


@login_required
@user_passes_test(is_staff)
def learning_cards(request):
    """Bilgi kartları listesi."""
    cards_list = LearningCard.objects.select_related(
        'experiment', 'experiment__category'
    ).order_by('-id')

    categories_list = Category.objects.filter(is_active=True)

    # Kategori filtresi
    category_id = request.GET.get('category')
    if category_id:
        cards_list = cards_list.filter(experiment__category_id=category_id)

    paginator = Paginator(cards_list, 20)
    page = request.GET.get('page')
    cards_page = paginator.get_page(page)

    context = {
        'active_menu': 'learning_cards',
        'learning_cards': cards_page,
        'categories': categories_list,
    }
    return render(request, 'admin_panel/learning_cards.html', context)


@login_required
@user_passes_test(is_staff)
def add_learning_card(request):
    """Yeni bilgi kartı ekle."""
    if request.method == 'POST':
        experiment_id = request.POST.get('experiment')
        title = request.POST.get('title')
        front_content = request.POST.get('front_content')
        back_content = request.POST.get('back_content')
        order = request.POST.get('order', 0)

        LearningCard.objects.create(
            experiment_id=experiment_id,
            title=title,
            front_content=front_content,
            back_content=back_content,
            order=order
        )
        messages.success(request, f'"{title}" kartı başarıyla eklendi!')
        return redirect('admin_panel:learning_cards')

    context = {
        'active_menu': 'learning_cards',
        'experiments': Experiment.objects.select_related('category').filter(is_active=True),
    }
    return render(request, 'admin_panel/learning_card_form.html', context)


@login_required
@user_passes_test(is_staff)
def edit_learning_card(request, pk):
    """Bilgi kartı düzenle."""
    card = get_object_or_404(LearningCard, pk=pk)

    if request.method == 'POST':
        card.experiment_id = request.POST.get('experiment')
        card.title = request.POST.get('title')
        card.front_content = request.POST.get('front_content')
        card.back_content = request.POST.get('back_content')
        card.order = request.POST.get('order', 0)
        card.save()

        messages.success(request, f'"{card.title}" kartı güncellendi!')
        return redirect('admin_panel:learning_cards')

    context = {
        'active_menu': 'learning_cards',
        'card': card,
        'experiments': Experiment.objects.select_related('category').filter(is_active=True),
    }
    return render(request, 'admin_panel/learning_card_form.html', context)


@login_required
@user_passes_test(is_staff)
def delete_learning_card(request, pk):
    """Bilgi kartı sil."""
    card = get_object_or_404(LearningCard, pk=pk)
    title = card.title
    card.delete()
    messages.success(request, f'"{title}" kartı silindi!')
    return redirect('admin_panel:learning_cards')


@login_required
@user_passes_test(is_staff)
def users(request):
    """Kullanıcı listesi."""
    users_list = User.objects.all().order_by('-date_joined')

    paginator = Paginator(users_list, 20)
    page = request.GET.get('page')
    users_page = paginator.get_page(page)

    context = {
        'active_menu': 'users',
        'users': users_page,
    }
    return render(request, 'admin_panel/users.html', context)
