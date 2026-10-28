import { render } from 'svelte/server';
import Page from './src/routes/kb/incidents/4471-date-causes/+page.svx';

export default function renderPage() {
  return render(Page);
}
