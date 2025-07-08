import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';

let tasks = [];

export const handlers = [
  http.get('/api/tasks', () => {
    return HttpResponse.json(tasks);
  }),

  http.post('/api/tasks', async ({ request }) => {
    const { title, description, deadline } = await request.json();
    const newTask = {
      id: uuidv4(),
      title,
      description,
      deadline,
      isCompleted: false,
    };
    tasks.push(newTask);
    return HttpResponse.json(newTask, { status: 201 });
  }),

  http.put('/api/tasks/:id', async ({ request, params }) => {
    const { id } = params;
    const updatedData = await request.json();

    tasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updatedData } : task
    );

    const updated = tasks.find((task) => task.id === id);
    return HttpResponse.json(updated);
  }),

  http.delete('/api/tasks/:id', ({ params }) => {
    const { id } = params;
    tasks = tasks.filter((task) => task.id !== id);
    return new HttpResponse(null, { status: 204 });
  }),
];