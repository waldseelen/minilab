"""
MiniLab - Experiments Admin
Kategoriler, Deneyler ve Öğrenme Kartları admin paneli.
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Experiment, LearningCard, ExperimentProgress


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Kategori admin paneli."""
    list_display = ['icon_display', 'name', 'slug', 'color_badge', 'experiment_count', 'order', 'is_active']
    list_filter = ['is_active', 'color']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['order', 'name']
    list_editable = ['order', 'is_active']

    def icon_display(self, obj):
        return format_html('<span style="font-size: 1.5em;">{}</span>', obj.icon)
    icon_display.short_description = 'İkon'

    def color_badge(self, obj):
        colors = {
            'blue': '#0088e6',
            'purple': '#8B5CF6',
            'green': '#10B981',
            'indigo': '#6366F1',
            'cyan': '#06B6D4',
            'pink': '#EC4899',
            'emerald': '#10B981',
            'amber': '#F59E0B',
            'red': '#EF4444',
            'rose': '#F43F5E',
        }
        hex_color = colors.get(obj.color, '#666')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 10px;">{}</span>',
            hex_color, obj.color
        )
    color_badge.short_description = 'Renk'

    def experiment_count(self, obj):
        count = obj.experiments.count()
        return format_html('<span style="font-weight: bold;">{}</span>', count)
    experiment_count.short_description = 'Deney Sayısı'


class LearningCardInline(admin.TabularInline):
    """Deney içinde kart gösterimi."""
    model = LearningCard
    extra = 1
    fields = ['title', 'front_content', 'order']
    ordering = ['order']


@admin.register(Experiment)
class ExperimentAdmin(admin.ModelAdmin):
    """Deney admin paneli."""
    list_display = ['title', 'category_display', 'experiment_type', 'difficulty_display', 'card_count', 'points', 'is_active', 'is_featured']
    list_filter = ['category', 'experiment_type', 'difficulty', 'is_active', 'is_featured']
    search_fields = ['title', 'short_description', 'description']
    prepopulated_fields = {'slug': ('title',)}
    ordering = ['category', 'order', 'title']
    list_editable = ['is_active', 'is_featured', 'points']
    inlines = [LearningCardInline]

    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('category', 'title', 'slug', 'short_description', 'description')
        }),
        ('Deney Tipi ve Zorluk', {
            'fields': ('experiment_type', 'difficulty', 'estimated_time', 'points')
        }),
        ('Görseller', {
            'fields': ('thumbnail', 'cover_image'),
            'classes': ('collapse',)
        }),
        ('Simülasyon/Video', {
            'fields': ('pixi_script', 'video_url'),
            'classes': ('collapse',)
        }),
        ('Eğitim İçeriği', {
            'fields': ('learning_objectives', 'parent_info'),
            'classes': ('collapse',)
        }),
        ('Ayarlar', {
            'fields': ('order', 'is_active', 'is_featured')
        }),
    )

    def category_display(self, obj):
        return format_html('{} {}', obj.category.icon, obj.category.name)
    category_display.short_description = 'Kategori'

    def difficulty_display(self, obj):
        colors = {'easy': '#10B981', 'medium': '#F59E0B', 'hard': '#EF4444'}
        return format_html(
            '<span style="color: {};">{}</span>',
            colors.get(obj.difficulty, '#666'), obj.get_difficulty_display()
        )
    difficulty_display.short_description = 'Zorluk'

    def card_count(self, obj):
        count = obj.learning_cards.count()
        return format_html('<span style="font-weight: bold;">{}</span> kart', count)
    card_count.short_description = 'Kartlar'


@admin.register(LearningCard)
class LearningCardAdmin(admin.ModelAdmin):
    """Öğrenme Kartları admin paneli."""
    list_display = ['title', 'experiment_display', 'category_display', 'front_preview', 'order']
    list_filter = ['experiment__category', 'experiment']
    search_fields = ['title', 'front_content', 'back_content']
    ordering = ['experiment__category', 'experiment', 'order']
    list_editable = ['order']

    fieldsets = (
        ('Temel Bilgiler', {
            'fields': ('experiment', 'title', 'order')
        }),
        ('Kart İçeriği', {
            'fields': ('front_content', 'back_content')
        }),
        ('Görseller', {
            'fields': ('front_image', 'back_image'),
            'classes': ('collapse',)
        }),
        ('Ses', {
            'fields': ('audio',),
            'classes': ('collapse',)
        }),
    )

    def experiment_display(self, obj):
        return obj.experiment.title
    experiment_display.short_description = 'Deney'

    def category_display(self, obj):
        cat = obj.experiment.category
        return format_html('{} {}', cat.icon, cat.name)
    category_display.short_description = 'Kategori'

    def front_preview(self, obj):
        preview = obj.front_content[:50] + '...' if len(obj.front_content) > 50 else obj.front_content
        return preview
    front_preview.short_description = 'Ön Yüz'


@admin.register(ExperimentProgress)
class ExperimentProgressAdmin(admin.ModelAdmin):
    """Deney İlerlemesi admin paneli."""
    list_display = ['child', 'experiment', 'status_display', 'score', 'attempts', 'time_display', 'completed_at']
    list_filter = ['status', 'experiment__category', 'experiment']
    search_fields = ['child__nickname', 'experiment__title']
    ordering = ['-completed_at', 'child']
    readonly_fields = ['started_at', 'completed_at']

    def status_display(self, obj):
        colors = {
            'not_started': '#9CA3AF',
            'in_progress': '#F59E0B',
            'completed': '#10B981'
        }
        icons = {
            'not_started': '⏸️',
            'in_progress': '🔄',
            'completed': '✅'
        }
        return format_html(
            '<span style="color: {};">{} {}</span>',
            colors.get(obj.status, '#666'),
            icons.get(obj.status, ''),
            obj.get_status_display()
        )
    status_display.short_description = 'Durum'

    def time_display(self, obj):
        if obj.time_spent:
            minutes = obj.time_spent // 60
            seconds = obj.time_spent % 60
            return f'{minutes}dk {seconds}sn'
        return '-'
    time_display.short_description = 'Süre'
