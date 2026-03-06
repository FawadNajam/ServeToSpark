'use client';

import Link from 'next/link';
import { Header } from '@components/Header';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-12 text-white shadow-lg">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Book services on demand
          </h1>
          <p className="mt-2 text-lg text-brand-100">
            Browse services, pick a time, and get things done.
          </p>
          <Link
            href="/services"
            className="mt-6 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow hover:bg-brand-50"
          >
            Browse services
          </Link>
        </section>
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-900">How it works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <div className="text-2xl font-bold text-brand-600">1</div>
              <h3 className="mt-2 font-medium text-slate-900">Choose a service</h3>
              <p className="mt-1 text-sm text-slate-600">
                Browse categories and pick the service you need.
              </p>
            </div>
            <div className="card p-5">
              <div className="text-2xl font-bold text-brand-600">2</div>
              <h3 className="mt-2 font-medium text-slate-900">Pick date & time</h3>
              <p className="mt-1 text-sm text-slate-600">
                Select when you want the provider to come.
              </p>
            </div>
            <div className="card p-5">
              <div className="text-2xl font-bold text-brand-600">3</div>
              <h3 className="mt-2 font-medium text-slate-900">Get it done</h3>
              <p className="mt-1 text-sm text-slate-600">
                A provider accepts your request and completes the job.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
