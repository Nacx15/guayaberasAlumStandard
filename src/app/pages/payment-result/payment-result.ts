import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { firstValueFrom } from 'rxjs';
import { CartService } from '../../services/cart.service';
import {
  CheckoutSession,
  CheckoutSessionService,
} from '../../services/checkout-session.service';
import { ToastService } from '../../services/toast.service';
import { OrderStatusResponse } from '../../models/payment.model';
import { getApiErrorMessage } from '../../shared/http/api-error.util';

type PaymentPageState = 'success' | 'failure' | 'pending';

@Component({
  selector: 'app-payment-result',
  imports: [RouterLink, MatIconModule, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <main class="min-h-[82vh] bg-[#0D131A] text-[#F9F7F2] px-4 py-12 sm:py-20 flex items-center justify-center relative overflow-hidden">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-[#AE875B]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00A7D4]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="w-full max-w-2xl bg-[#151F2A] border border-[#AE875B]/30 rounded-3xl text-center px-6 py-10 md:px-12 md:py-14 shadow-2xl relative z-10 space-y-6">
        <div
          class="w-20 h-20 rounded-full mx-auto flex items-center justify-center border shadow-xl transition-all"
          [class]="isApproved()
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
            : isTerminalFailure()
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-rose-500/10'
              : 'bg-amber-500/10 border-[#AE875B]/40 text-[#C9A87C] shadow-amber-500/10'"
        >
          <mat-icon class="text-4xl w-10 h-10 flex items-center justify-center">
            {{ isApproved() ? 'check_circle' : isTerminalFailure() ? 'cancel' : 'hourglass_top' }}
          </mat-icon>
        </div>

        @if (isApproved()) {
          <div class="space-y-2">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <mat-icon class="text-xs">verified</mat-icon>
              Pago confirmado
            </span>
            <h1 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              ¡Gracias por tu compra!
            </h1>
          </div>
          <p class="text-sm sm:text-base text-stone-300 max-w-lg mx-auto leading-relaxed font-sans">
            GuayaFlow confirmó el pago de tu pedido mediante el estado firmado y la conciliación de Mercado Pago.
          </p>
        } @else if (isTerminalFailure()) {
          <div class="space-y-2">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <mat-icon class="text-xs">error_outline</mat-icon>
              Pedido liberado
            </span>
            <h1 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Tu pedido ya no está reservado.
            </h1>
          </div>
          <p class="text-sm sm:text-base text-stone-300 max-w-lg mx-auto leading-relaxed font-sans">
            Puedes recuperar el carrito. Antes de restaurarlo volveremos a validar precio y existencia con GuayaFlow.
          </p>
        } @else if (pageState === 'failure') {
          <div class="space-y-2">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <mat-icon class="text-xs">sync</mat-icon>
              Verificando pedido
            </span>
            <h1 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Estamos verificando tu pago.
            </h1>
          </div>
          <p class="text-sm sm:text-base text-stone-300 max-w-lg mx-auto leading-relaxed font-sans">
            No generes otro pedido todavía. La URL de retorno no decide el resultado: esperaremos el estado real de GuayaFlow.
          </p>
        } @else {
          <div class="space-y-2">
            <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#AE875B]/20 text-[#C9A87C] border border-[#AE875B]/40">
              <mat-icon class="text-xs">hourglass_empty</mat-icon>
              {{ pageState === 'pending' ? 'Pago pendiente' : 'Operación recibida' }}
            </span>
            <h1 class="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Estamos confirmando tu pago.
            </h1>
          </div>
          <p class="text-sm sm:text-base text-stone-300 max-w-lg mx-auto leading-relaxed font-sans">
            Consultamos el pedido existente con su enlace firmado. No necesitas crear otra venta ni otra reserva.
          </p>
        }

        @if (status(); as order) {
          <div class="bg-[#0D131A] border border-stone-800 rounded-2xl p-5 text-left grid sm:grid-cols-2 gap-3 text-xs">
            <div>
              <p class="text-stone-500 uppercase tracking-wider text-[10px]">Pedido</p>
              <p class="font-mono font-bold text-[#C9A87C] mt-1">#{{ order.sale_id }}</p>
            </div>
            <div>
              <p class="text-stone-500 uppercase tracking-wider text-[10px]">Total autoritativo</p>
              <p class="font-bold text-white mt-1">\${{ order.total | number:'1.2-2' }} MXN</p>
            </div>
            <div>
              <p class="text-stone-500 uppercase tracking-wider text-[10px]">Estado de venta</p>
              <p class="font-semibold text-stone-200 mt-1">{{ saleStatusLabel(order.sale_status) }}</p>
            </div>
            <div>
              <p class="text-stone-500 uppercase tracking-wider text-[10px]">Estado de pago</p>
              <p class="font-semibold text-stone-200 mt-1">{{ paymentStatusLabel(order.payment_status) }}</p>
            </div>
          </div>
        } @else if (saleId()) {
          <div class="inline-flex items-center gap-3 px-5 py-2.5 bg-[#0D131A] border border-[#AE875B]/30 rounded-2xl shadow-inner">
            <span class="text-xs uppercase tracking-widest text-stone-400 font-semibold">Folio de Pedido:</span>
            <span class="font-mono font-bold text-[#C9A87C] text-sm sm:text-base">#{{ saleId() }}</span>
          </div>
        }

        <div class="pt-2 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4">
          @if (canRestoreCart()) {
            <button
              type="button"
              (click)="restoreCart()"
              [disabled]="checking()"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#AE875B] to-[#C9A87C] hover:opacity-95 text-[#0D131A] px-8 py-3.5 text-xs uppercase tracking-widest font-bold rounded-xl transition-all shadow-lg disabled:opacity-50"
            >
              <mat-icon class="text-sm">shopping_cart</mat-icon>
              Recuperar carrito
            </button>
          }

          @if (!isApproved() && !isTerminalFailure() && session()) {
            <button
              type="button"
              (click)="refreshStatus(true)"
              [disabled]="checking()"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#AE875B]/40 hover:border-[#AE875B] bg-[#0D131A]/70 text-[#F9F7F2] px-8 py-3.5 text-xs uppercase tracking-widest font-bold rounded-xl transition-all disabled:opacity-50"
            >
              <mat-icon class="text-sm" [class.animate-spin]="checking()">sync</mat-icon>
              Verificar nuevamente
            </button>
          }

          <a
            routerLink="/catalogo"
            class="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#AE875B]/40 hover:border-[#AE875B] bg-[#0D131A]/70 text-[#F9F7F2] px-8 py-3.5 text-xs uppercase tracking-widest font-bold rounded-xl transition-all"
          >
            <mat-icon class="text-sm">storefront</mat-icon>
            Ver catálogo
          </a>
        </div>

        @if (!session() && !isApproved()) {
          <p class="text-xs text-stone-400 max-w-md mx-auto leading-relaxed pt-2">
            No encontramos el contexto local del checkout. Por seguridad no consultamos un pedido sin su enlace firmado.
          </p>
        } @else if (checking()) {
          <p class="text-xs text-stone-400 max-w-md mx-auto leading-relaxed pt-2">
            Consultando el estado firmado del pedido en GuayaFlow…
          </p>
        }
      </div>
    </main>
  `,
})
export class PaymentResultPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly checkoutSession = inject(CheckoutSessionService);
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageState = (this.route.snapshot.data['paymentState'] as PaymentPageState | undefined) ?? 'pending';
  readonly saleId = signal<number | null>(this.resolveSaleId());
  readonly session = signal<CheckoutSession | null>(null);
  readonly status = signal<OrderStatusResponse['data'] | null>(null);
  readonly checking = signal(false);

  private pollTimer: ReturnType<typeof setTimeout> | null = null;
  private pollCount = 0;
  private readonly maxPolls = 15;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const local = this.checkoutSession.getForSale(this.saleId());
    this.session.set(local);

    if (!this.saleId() && local) {
      this.saleId.set(local.saleId);
    }

    if (local?.orderStatusUrl) {
      void this.refreshStatus(false);
    }

    this.destroyRef.onDestroy(() => this.stopTimerOnly());
  }

  async refreshStatus(manual = false): Promise<void> {
    const local = this.session();
    if (!local?.orderStatusUrl || this.checking()) return;

    this.checking.set(true);

    try {
      const response = await firstValueFrom(
        this.http.get<OrderStatusResponse>(local.orderStatusUrl)
      );

      this.status.set(response.data);
      this.saleId.set(response.data.sale_id);

      if (this.isApproved()) {
        this.stopPolling();
        this.cart.clearCart();
        this.checkoutSession.clear();
        this.toast.show(`Pago confirmado. Pedido #${response.data.sale_id}.`, 'success', 6000);
        return;
      }

      if (this.isTerminalFailure()) {
        this.stopPolling();
        return;
      }

      if (this.pollCount < this.maxPolls) {
        this.schedulePoll();
      }

      if (manual) {
        this.toast.show('El pedido todavía no aparece como pagado o liberado en GuayaFlow.', 'info', 5000);
      }
    } catch (error) {
      if (manual) {
        this.toast.show(getApiErrorMessage(error, 'No pudimos consultar el pedido. Intenta nuevamente.'), 'error', 6000);
      }
    } finally {
      this.checking.set(false);
    }
  }

  isApproved(): boolean {
    const current = this.status();
    return !!current && current.sale_status === 'approved' && current.payment_status === 'paid';
  }

  isTerminalFailure(): boolean {
    const current = this.status();
    return !!current && ['expired', 'cancelled', 'failed'].includes(current.sale_status);
  }

  canRestoreCart(): boolean {
    return this.isTerminalFailure() && (this.session()?.cartItems?.length ?? 0) > 0;
  }

  async restoreCart(): Promise<void> {
    const local = this.session();
    if (!local?.cartItems?.length || this.checking()) return;

    this.checking.set(true);
    const previousCart = [...this.cart.items()];
    this.cart.restoreSnapshot(local.cartItems);

    try {
      await this.cart.refreshAvailability();
      this.checkoutSession.clear();
      this.session.set(null);
      this.toast.show('Carrito recuperado con precio y existencia vigentes.', 'success', 6000);
    } catch (error) {
      this.cart.restoreSnapshot(previousCart);
      this.toast.show(getApiErrorMessage(error, 'No pudimos revalidar el carrito recuperado.'), 'error', 6000);
    } finally {
      this.checking.set(false);
    }
  }

  saleStatusLabel(status: string): string {
    return ({
      pending: 'Pendiente',
      approved: 'Aprobado',
      cancelled: 'Cancelado',
      failed: 'Fallido',
      expired: 'Expirado',
    } as Record<string, string>)[status] || status;
  }

  paymentStatusLabel(status: string): string {
    return ({
      pending: 'En validación',
      paid: 'Pagado',
      partial: 'Parcial',
      unpaid: 'Sin pago',
    } as Record<string, string>)[status] || status;
  }

  private schedulePoll(): void {
    this.pollCount++;
    this.stopTimerOnly();
    this.pollTimer = setTimeout(() => void this.refreshStatus(false), 2000);
  }

  private stopTimerOnly(): void {
    if (this.pollTimer) {
      clearTimeout(this.pollTimer);
      this.pollTimer = null;
    }
  }

  private stopPolling(): void {
    this.stopTimerOnly();
    this.pollCount = this.maxPolls;
  }

  private resolveSaleId(): number | null {
    const candidates = [
      this.route.snapshot.queryParamMap.get('sale_id'),
      this.route.snapshot.queryParamMap.get('external_reference'),
    ];

    const value = candidates.find((candidate) => !!candidate && /^\d+$/.test(candidate));
    return value ? Number(value) : null;
  }
}
