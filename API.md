# PlanSync API Documentation

Base URL: `http://localhost:8000/api/`  
Auth: `Authorization: Bearer <token>`  
Format: JSON

---

## Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register/` | Регистрация |
| POST | `/auth/login/` | Логин, возвращает JWT токены |
| POST | `/auth/logout/` | Логаут |
| POST | `/auth/token/refresh/` | Обновить access токен |

---

## Groups

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/groups/` | Список групп / создать группу |
| GET/PUT/DELETE | `/groups/<id>/` | Детали / изменить / удалить |
| POST | `/groups/<id>/join/` | Вступить по коду |
| GET | `/groups/<id>/members/` | Список участников |

---

## Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/groups/<id>/events/` | Список событий / создать |
| GET/PUT/DELETE | `/groups/<id>/events/<id>/` | Детали / изменить / удалить |
| POST | `/groups/<id>/events/<id>/rsvp/` | Going / Maybe / Not going |

---

## Polls

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/groups/<id>/polls/` | Список опросов / создать |
| GET/PUT/DELETE | `/groups/<id>/polls/<id>/` | Детали / изменить / удалить |
| POST | `/groups/<id>/polls/<id>/vote/` | Проголосовать |
| GET | `/groups/<id>/polls/<id>/results/` | Результаты голосования |

---

## Invitations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PUT | `/invitations/` | Список приглашений |
| POST | `/invitations/<id>/accept/` | Принять |
| POST | `/invitations/<id>/decline/` | Отклонить |

---

## Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PUT | `/profile/` | Просмотр / редактирование профиля |