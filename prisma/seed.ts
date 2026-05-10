import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.repairCase.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.review.deleteMany()
  await prisma.order.deleteMany()
  await prisma.repairService.deleteMany()
  await prisma.phone.deleteMany()

  // Seed Phones
  const phones = await prisma.phone.createMany({
    data: [
      {
        brand: 'Apple',
        model: 'iPhone 13',
        storage: '128 ГБ',
        color: 'Полночный',
        condition: 'Отличное',
        price: 18999,
        description: 'Восстановленный iPhone 13 в отличном состоянии. Заменён дисплей на оригинальный, батарея 95%.',
        available: true,
      },
      {
        brand: 'Apple',
        model: 'iPhone 14',
        storage: '256 ГБ',
        color: 'Звёздный свет',
        condition: 'Хорошее',
        price: 24499,
        description: 'iPhone 14 с заменённым экраном. Все функции работают безупречно.',
        available: true,
      },
      {
        brand: 'Apple',
        model: 'iPhone 12',
        storage: '64 ГБ',
        color: 'Синий',
        condition: 'Хорошее',
        price: 12999,
        description: 'iPhone 12 с небольшими следами использования. Батарея 88%.',
        available: true,
      },
      {
        brand: 'Apple',
        model: 'iPhone 15',
        storage: '128 ГБ',
        color: 'Розовый',
        condition: 'Отличное',
        price: 29999,
        description: 'Практически новый iPhone 15. Полная диагностика пройдена.',
        available: true,
      },
      {
        brand: 'Apple',
        model: 'iPhone 11',
        storage: '64 ГБ',
        color: 'Чёрный',
        condition: 'Удовлетворительное',
        price: 8999,
        description: 'iPhone 11 с следами использования. Все функции работают.',
        available: true,
      },
      {
        brand: 'Samsung',
        model: 'Galaxy S23',
        storage: '128 ГБ',
        color: 'Фантомный чёрный',
        condition: 'Отличное',
        price: 22499,
        description: 'Восстановленный Galaxy S23. Заменена задняя панель, состояние как новый.',
        available: true,
      },
      {
        brand: 'Samsung',
        model: 'Galaxy S22',
        storage: '256 ГБ',
        color: 'Фантомный белый',
        condition: 'Хорошее',
        price: 17999,
        description: 'Galaxy S22 с заменённым дисплеем. Работает отлично.',
        available: true,
      },
      {
        brand: 'Samsung',
        model: 'Galaxy A54',
        storage: '128 ГБ',
        color: 'Графитовый',
        condition: 'Хорошее',
        price: 9999,
        description: 'Galaxy A54 в хорошем состоянии. Минимальные следы использования.',
        available: true,
      },
      {
        brand: 'Samsung',
        model: 'Galaxy S24',
        storage: '256 ГБ',
        color: 'Кобальтовый фиолетовый',
        condition: 'Отличное',
        price: 31999,
        description: 'Флагман Galaxy S24 в идеальном состоянии. Полная проверка.',
        available: true,
      },
      {
        brand: 'Xiaomi',
        model: 'Redmi Note 12 Pro',
        storage: '128 ГБ',
        color: 'Синий',
        condition: 'Хорошее',
        price: 6999,
        description: 'Redmi Note 12 Pro с заменённым экраном. Камера 200 МП работает отлично.',
        available: true,
      },
      {
        brand: 'Xiaomi',
        model: '13T Pro',
        storage: '256 ГБ',
        color: 'Чёрный',
        condition: 'Отличное',
        price: 14499,
        description: 'Xiaomi 13T Pro в отличном состоянии. Быстрая зарядка 120 Вт.',
        available: true,
      },
      {
        brand: 'Xiaomi',
        model: 'Poco X5 Pro',
        storage: '128 ГБ',
        color: 'Жёлтый',
        condition: 'Хорошее',
        price: 7499,
        description: 'Poco X5 Pro с небольшими следами использования. Производительный гаджет.',
        available: true,
      },
      {
        brand: 'Apple',
        model: 'iPhone SE 2022',
        storage: '64 ГБ',
        color: 'Полночный',
        condition: 'Хорошее',
        price: 9999,
        description: 'iPhone SE 3-го поколения. Компактный и мощный.',
        available: true,
      },
      {
        brand: 'Samsung',
        model: 'Galaxy A34',
        storage: '128 ГБ',
        color: 'Изумрудный',
        condition: 'Удовлетворительное',
        price: 7499,
        description: 'Galaxy A34 с следами использования, но полностью рабочий.',
        available: true,
      },
    ],
  })

  // Seed Repair Services
  const repairServices = await prisma.repairService.createMany({
    data: [
      {
        brand: 'Apple',
        model: 'iPhone 13',
        repairType: 'Замена экрана',
        basePartCost: 4500,
        laborCost: 800,
        description: 'Замена дисплея iPhone 13 на оригинальный модуль',
      },
      {
        brand: 'Apple',
        model: 'iPhone 13',
        repairType: 'Замена батареи',
        basePartCost: 1200,
        laborCost: 400,
        description: 'Установка новой оригинальной батареи iPhone 13',
      },
      {
        brand: 'Apple',
        model: 'iPhone 14',
        repairType: 'Замена экрана',
        basePartCost: 5500,
        laborCost: 800,
        description: 'Замена дисплея iPhone 14 на оригинальный модуль',
      },
      {
        brand: 'Apple',
        model: 'iPhone 14',
        repairType: 'Замена батареи',
        basePartCost: 1400,
        laborCost: 400,
        description: 'Установка новой оригинальной батареи iPhone 14',
      },
      {
        brand: 'Apple',
        model: 'iPhone 15',
        repairType: 'Замена экрана',
        basePartCost: 7500,
        laborCost: 1000,
        description: 'Замена дисплея iPhone 15 на оригинальный модуль',
      },
      {
        brand: 'Apple',
        model: 'iPhone 15',
        repairType: 'Замена камеры',
        basePartCost: 5000,
        laborCost: 800,
        description: 'Замена основной камеры iPhone 15',
      },
      {
        brand: 'Samsung',
        model: 'Galaxy S23',
        repairType: 'Замена экрана',
        basePartCost: 5000,
        laborCost: 700,
        description: 'Замена AMOLED дисплея Galaxy S23',
      },
      {
        brand: 'Samsung',
        model: 'Galaxy S23',
        repairType: 'Замена батареи',
        basePartCost: 1500,
        laborCost: 400,
        description: 'Замена батареи Galaxy S23 на оригинальную',
      },
      {
        brand: 'Samsung',
        model: 'Galaxy S24',
        repairType: 'Замена экрана',
        basePartCost: 6500,
        laborCost: 800,
        description: 'Замена AMOLED дисплея Galaxy S24',
      },
      {
        brand: 'Samsung',
        model: 'Galaxy A54',
        repairType: 'Замена экрана',
        basePartCost: 2500,
        laborCost: 500,
        description: 'Замена дисплея Galaxy A54',
      },
      {
        brand: 'Samsung',
        model: 'Galaxy A54',
        repairType: 'Ремонт разъёма зарядки',
        basePartCost: 800,
        laborCost: 400,
        description: 'Замена разъёма зарядки Galaxy A54',
      },
      {
        brand: 'Xiaomi',
        model: 'Redmi Note 12 Pro',
        repairType: 'Замена экрана',
        basePartCost: 2200,
        laborCost: 500,
        description: 'Замена AMOLED дисплея Redmi Note 12 Pro',
      },
      {
        brand: 'Xiaomi',
        model: 'Redmi Note 12 Pro',
        repairType: 'Замена батареи',
        basePartCost: 900,
        laborCost: 300,
        description: 'Замена батареи Redmi Note 12 Pro',
      },
      {
        brand: 'Xiaomi',
        model: '13T Pro',
        repairType: 'Замена экрана',
        basePartCost: 3500,
        laborCost: 600,
        description: 'Замена AMOLED дисплея Xiaomi 13T Pro',
      },
      {
        brand: 'Xiaomi',
        model: '13T Pro',
        repairType: 'Замена камеры',
        basePartCost: 2800,
        laborCost: 500,
        description: 'Замена основной камеры Xiaomi 13T Pro',
      },
      {
        brand: 'Apple',
        model: 'iPhone 12',
        repairType: 'Замена экрана',
        basePartCost: 3500,
        laborCost: 700,
        description: 'Замена дисплея iPhone 12 на оригинальный модуль',
      },
      {
        brand: 'Apple',
        model: 'iPhone 12',
        repairType: 'Ремонт разъёма зарядки',
        basePartCost: 1000,
        laborCost: 500,
        description: 'Замена разъёма зарядки iPhone 12',
      },
      {
        brand: 'Apple',
        model: 'iPhone SE 2022',
        repairType: 'Замена экрана',
        basePartCost: 2000,
        laborCost: 500,
        description: 'Замена дисплея iPhone SE 2022',
      },
      {
        brand: 'Samsung',
        model: 'Galaxy S22',
        repairType: 'Замена батареи',
        basePartCost: 1300,
        laborCost: 400,
        description: 'Замена батареи Galaxy S22',
      },
      {
        brand: 'Xiaomi',
        model: 'Poco X5 Pro',
        repairType: 'Замена кнопок',
        basePartCost: 700,
        laborCost: 400,
        description: 'Ремонт кнопок Poco X5 Pro',
      },
    ],
  })

  // Seed Reviews
  const reviews = await prisma.review.createMany({
    data: [
      {
        author: 'Александр К.',
        text: 'Заменили экран на iPhone 13 за 40 минут! Качество отличное, всё работает как новое. Очень доволен сервисом.',
        rating: 5,
        avatarUrl: null,
      },
      {
        author: 'Мария П.',
        text: 'Пришла с проблемой батареи на Samsung. Заменили быстро и по доступной цене. Дали гарантию на работу. Рекомендую!',
        rating: 5,
        avatarUrl: null,
      },
      {
        author: 'Дмитрий В.',
        text: 'Хороший сервис, мастера знают своё дело. Починили разъём зарядки на Xiaomi. Цена адекватная, сроки минимальные.',
        rating: 4,
        avatarUrl: null,
      },
      {
        author: 'Елена С.',
        text: 'Купила восстановленный iPhone 14 — выглядит как новый! Работает безупречно уже 3 месяца. Спасибо за честный подход.',
        rating: 5,
        avatarUrl: null,
      },
      {
        author: 'Игорь Н.',
        text: 'Делал замену камеры на iPhone 15. Сделали за час, камера работает идеально. Гарантия 6 месяцев — это серьёзно.',
        rating: 5,
        avatarUrl: null,
      },
      {
        author: 'Ольга Т.',
        text: 'Обратилась для ремонта экрана на Samsung Galaxy A54. Быстро, качественно, недорого. Буду обращаться ещё.',
        rating: 4,
        avatarUrl: null,
      },
      {
        author: 'Андрей М.',
        text: 'Починили кнопку включения на Xiaomi Poco. Ребята — профессионалы. Всё сделали аккуратно и с гарантией.',
        rating: 5,
        avatarUrl: null,
      },
    ],
  })

  // Seed Blog Posts
  const blogPosts = await prisma.blogPost.createMany({
    data: [
      {
        title: 'Как продлить жизнь батареи вашего смартфона',
        excerpt: 'Простые советы, которые помогут сохранить ёмкость аккумулятора и увеличить время работы телефона без подзарядки.',
        content: null,
        imageUrl: null,
        author: 'СервисМастер',
      },
      {
        title: 'Оригинальные запчасти vs аналоги: что выбрать?',
        excerpt: 'Разбираемся в отличиях оригинальных деталей от качественных аналогов и помогаем сделать правильный выбор при ремонте.',
        content: null,
        imageUrl: null,
        author: 'СервисМастер',
      },
      {
        title: '5 признаков того, что вашему телефону нужен ремонт',
        excerpt: 'Узнайте, какие симптомы говорят о том, что ваш смартфон пора показать специалисту, пока проблема не усугубилась.',
        content: null,
        imageUrl: null,
        author: 'СервисМастер',
      },
    ],
  })

  // Seed Repair Cases
  const repairCases = await prisma.repairCase.createMany({
    data: [
      {
        title: 'Замена экрана iPhone 13',
        description: 'Клиент принёс iPhone 13 с разбитым экраном. Заменили дисплей на оригинальный модуль за 40 минут.',
        beforeImage: null,
        afterImage: null,
      },
      {
        title: 'Восстановление Samsung Galaxy S23 после воды',
        description: 'Телефон упал в воду. Провели ультразвуковую чистку, заменили повреждённые компоненты. Устройство работает как новое.',
        beforeImage: null,
        afterImage: null,
      },
      {
        title: 'Замена батареи Xiaomi 13T Pro',
        description: 'Батарея держала менее 2 часов. Установили новую оригинальную батарею — теперь работает весь день.',
        beforeImage: null,
        afterImage: null,
      },
      {
        title: 'Ремонт камеры iPhone 15',
        description: 'Камера не фокусировалась. Заменили модуль камеры — качество фото восстановлено на 100%.',
        beforeImage: null,
        afterImage: null,
      },
    ],
  })

  console.log('Seed data created successfully!')
  console.log(`- Phones: 14`)
  console.log(`- Repair Services: 20`)
  console.log(`- Reviews: 7`)
  console.log(`- Blog Posts: 3`)
  console.log(`- Repair Cases: 4`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
