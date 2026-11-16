document.addEventListener('DOMContentLoaded', () => {
    
    // --- Логика смены цвета фона при скролле ---
    const body = document.body;
    
    window.addEventListener('scroll', () => {
        // Получаем высоту прокрутки и общую высоту документа
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Вычисляем процент прокрутки (от 0 до 1)
        let scrollPercent = scrollY / docHeight;
        if (scrollPercent > 1) scrollPercent = 1;

        // Логика цветов:
        // 0.0 - 0.5: Светлые тона (Желтый -> Голубой -> Зеленый)
        // 0.5 - 1.0: Темные тона (Серый -> Фиолетовый -> Мрачный)
        
        let bgColor;
        
        if (scrollPercent < 0.5) {
            // Первая половина: светлая
            // Интерполяция между светло-желтым и светло-зеленым/голубым
            // Для простоты используем HSL или готовые значения
            if(scrollPercent < 0.25) {
                 body.style.backgroundColor = '#fffde7'; // Желтоватый
            } else {
                 body.style.backgroundColor = '#e0f7fa'; // Голубоватый
            }
            body.classList.remove('dark-mode');
        } else {
            // Вторая половина: затемнение
            // Чем ниже, тем фиолетовее
            body.classList.add('dark-mode');
            
            // Простая формула для затемнения: от белого к темно-фиолетовому (#2e003e)
            // Используем RGB интерполяцию для плавности
            // Start (светло-серый): 240, 240, 240
            // End (темно-фиолетовый): 30, 0, 50
            
            const p = (scrollPercent - 0.5) * 2; // Нормализуем от 0 до 1 для второй половины
            
            const r = Math.round(240 - (210 * p));
            const g = Math.round(240 - (240 * p));
            const b = Math.round(240 - (190 * p));
            
            bgColor = `rgb(${r}, ${g}, ${b})`;
            body.style.backgroundColor = bgColor;
        }
    });

    // --- Логика переворота карточек ---
    const cards = document.querySelectorAll('.flip-card');

    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Если кликнули на кнопку закрытия, не переворачиваем обратно сразу (обрабатывается отдельно),
            // но здесь логика простая: клик по карте переворачивает её.
            if (!e.target.classList.contains('close-btn')) {
                this.classList.toggle('flipped');
            }
        });

        const closeBtn = card.querySelector('.close-btn');
        if(closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation(); // Чтобы не сработал клик по самой карте
                card.classList.remove('flipped');
            });
        }
    });
});

// --- Логика постов и лайков ---

function toggleLike(btn) {
    const span = btn.querySelector('span');
    let count = parseInt(span.innerText);
    
    // Простая имитация лайка (без сохранения на сервере)
    if (btn.classList.contains('liked')) {
        count--;
        btn.classList.remove('liked');
        btn.style.color = '#ff6b6b';
    } else {        count++;
        btn.classList.add('liked');
        btn.style.color = 'red';
    }
    span.innerText = count;
}

function addPost() {
    const textarea = document.querySelector('.post-input-area textarea');
    const text = textarea.value.trim();
    
    if (text === "") return alert("Введите текст!");

    const container = document.getElementById('posts-container');
    
    // Создаем новый элемент поста
    const newPost = document.createElement('div');
    newPost.className = 'fan-post';
    
    const date = new Date().toLocaleDateString();
    
    newPost.innerHTML = `
        <div class="author">Гость (${date})</div>
        <div class="content">${text}</div>
        <div class="actions">
            <button class="like-btn" onclick="toggleLike(this)">❤️ <span>0</span></button>
        </div>
    `;
    
    // Добавляем в начало списка
    container.prepend(newPost);
    
    // Очищаем поле
    textarea.value = "";
}