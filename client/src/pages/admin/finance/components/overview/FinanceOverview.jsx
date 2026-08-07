import { useEffect, useRef, useState } from "react";
import { AdminCard } from "../../../components/AdminCard";
import { SectionHeader } from "../../../components/SectionHeader";
import { financeOverviewData } from "../../finance.data";
import {
  calculateEstimatedPlatformRevenue,
  getFinancePeriodMultiplier,
  getFinanceTrendChartWidth,
  getFinanceTrendTooltipStyle,
  scaleFinanceValue,
} from "../../finance.utils";
import { formatWholeMoney } from "../../finance.formatters";

const FINANCE_TREND_CHART_HEIGHT = 180;

function FinanceTrendChart({ period }) {
  const points = financeOverviewData.revenueTrend;
  const [activeIndex, setActiveIndex] = useState(null);
  const [tooltipStyle, setTooltipStyle] = useState(undefined);
  const [chartWidth, setChartWidth] = useState(1320);
  const chartStageRef = useRef(null);
  const chartSeries = [
    { key: "grossRevenue", label: "Gross revenue", tone: "gross" },
    { key: "restaurantPayouts", label: "Restaurant payouts", tone: "payouts" },
    { key: "netPlatformRevenue", label: "Net platform revenue", tone: "fees" },
  ];
  const chartHeight = FINANCE_TREND_CHART_HEIGHT;
  const padding = { top: 10, right: 48, bottom: 25, left: 62 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  const activePoint = activeIndex === null ? null : points[activeIndex];
  const yMax = 11000;
  const xFor = (index) =>
    padding.left +
    (points.length === 1 ? 0 : (index / (points.length - 1)) * plotWidth);
  const yFor = (value) =>
    padding.top + plotHeight - (Number(value || 0) / yMax) * plotHeight;
  const toPolyline = (key) =>
    points.map((point, index) => `${xFor(index)},${yFor(point[key])}`).join(" ");
  const shouldShowXAxisLabel = (index) =>
    index % 2 === 0 || index === points.length - 1;
  const setActiveChartPoint = (index, svgElement) => {
    const bounds = svgElement.getBoundingClientRect();
    const point = points[index];
    const renderedPointX = (xFor(index) / chartWidth) * bounds.width;
    const renderedPointY = (yFor(point.grossRevenue) / chartHeight) * bounds.height;

    setActiveIndex(index);
    setTooltipStyle(
      getFinanceTrendTooltipStyle({
        pointX: renderedPointX,
        pointY: renderedPointY,
        chartWidth: bounds.width,
        chartHeight: bounds.height,
      }),
    );
  };
  const activateNearestPoint = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX =
      ((event.clientX - bounds.left) / bounds.width) * chartWidth - padding.left;
    const clampedRatio = Math.max(0, Math.min(1, relativeX / plotWidth));
    const nearestIndex = Math.round(clampedRatio * (points.length - 1));
    setActiveChartPoint(nearestIndex, event.currentTarget);
  };
  const yTicks = [0, 2500, 5000, 7500, 10000];

  useEffect(() => {
    const stage = chartStageRef.current;

    if (!stage || typeof ResizeObserver === "undefined") return undefined;

    const updateChartWidth = () => {
      const nextWidth = getFinanceTrendChartWidth(
        stage.clientWidth,
        FINANCE_TREND_CHART_HEIGHT,
      );
      setChartWidth((currentWidth) =>
        currentWidth === nextWidth ? currentWidth : nextWidth,
      );
    };

    updateChartWidth();
    const observer = new ResizeObserver(updateChartWidth);
    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  return (
    <AdminCard className="admin-finance-overview-card admin-finance-overview-card--trend">
      <div className="admin-finance-trend__header">
        <SectionHeader title="Financial Performance Trend" />
        <div className="admin-finance-trend__legend" aria-label="Chart series">
          {chartSeries.map((series) => (
            <span key={series.key}>
              <i
                className={`admin-finance-trend__legend-dot admin-finance-trend__legend-dot--${series.tone}`}
                aria-hidden="true"
              />
              {series.label}
            </span>
          ))}
        </div>
      </div>
      <div className="admin-finance-trend" aria-label={`Revenue trend chart for ${period}`}>
        <div className="admin-finance-trend__stage" ref={chartStageRef}>
          {activePoint && (
            <div
              className="admin-finance-trend__tooltip"
              role="status"
              aria-live="polite"
              style={tooltipStyle}
            >
              <strong>{activePoint.label}</strong>
              <span>Gross revenue: {formatWholeMoney(activePoint.grossRevenue)}</span>
              <span>
                Restaurant payouts: {formatWholeMoney(activePoint.restaurantPayouts)}
              </span>
              <span>
                Net platform revenue: {formatWholeMoney(activePoint.netPlatformRevenue)}
              </span>
            </div>
          )}
          <svg
            className="admin-finance-trend__chart"
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            role="img"
            aria-label="Twelve week financial performance line chart"
            onMouseMove={activateNearestPoint}
            onMouseLeave={() => {
              setActiveIndex(null);
              setTooltipStyle(undefined);
            }}
          >
          {yTicks.map((tick) => {
            const y = yFor(tick);
            return (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  className="admin-finance-trend__grid"
                />
                <text
                  x={padding.left - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="admin-finance-trend__axis-label admin-finance-trend__axis-label--y"
                >
                  {formatWholeMoney(tick)}
                </text>
              </g>
            );
          })}
          {chartSeries.map((series) => (
            <polyline
              key={series.key}
              points={toPolyline(series.key)}
              className={`admin-finance-trend__line admin-finance-trend__line--${series.tone}`}
            />
          ))}
          {points.map((point, index) => {
            const isActive = activeIndex === index;
            const isCurrent = index === points.length - 1;

            return (
              <g
                key={point.label}
                className={
                  isActive
                    ? "admin-finance-trend__point-group is-active"
                    : isCurrent
                      ? "admin-finance-trend__point-group is-current"
                    : "admin-finance-trend__point-group"
                }
                aria-label={`${point.label} financial data`}
                onClick={(event) =>
                  setActiveChartPoint(index, event.currentTarget.ownerSVGElement)
                }
                onMouseEnter={(event) =>
                  setActiveChartPoint(index, event.currentTarget.ownerSVGElement)
                }
                onFocus={(event) =>
                  setActiveChartPoint(index, event.currentTarget.ownerSVGElement)
                }
                tabIndex="0"
              >
                <line
                  x1={xFor(index)}
                  y1={padding.top}
                  x2={xFor(index)}
                  y2={padding.top + plotHeight}
                  className="admin-finance-trend__active-line"
                />
                {chartSeries.map((series) => (
                  <circle
                    key={series.key}
                    cx={xFor(index)}
                    cy={yFor(point[series.key])}
                    r={isActive || isCurrent ? "3.4" : "2.2"}
                    className={`admin-finance-trend__dot admin-finance-trend__dot--${series.tone}`}
                  />
                ))}
                {shouldShowXAxisLabel(index) && (
                  <text
                    x={xFor(index)}
                    y={chartHeight - 9}
                    textAnchor="middle"
                    className="admin-finance-trend__axis-label admin-finance-trend__axis-label--x"
                  >
                    {point.label}
                  </text>
                )}
              </g>
            );
          })}
          </svg>
        </div>
      </div>
    </AdminCard>
  );
}

function CostsAdjustmentsChart({ period }) {
  const multiplier = getFinancePeriodMultiplier(period);
  const points = financeOverviewData.revenueTrend;
  const maxValue = Math.max(
    ...points.flatMap((point) => [point.refunds, point.platformPromoCost]),
  );
  const axisMax = Math.ceil(maxValue / 100) * 100;
  const guideRatios = [1, 0.75, 0.5, 0.25, 0];

  return (
    <AdminCard className="admin-finance-overview-card admin-finance-overview-card--costs">
      <div className="admin-finance-costs__header">
        <SectionHeader title="Costs & Adjustments" />
        <div className="admin-finance-costs__legend">
          <span><i className="is-refund" />Refunds</span>
          <span><i className="is-promo" />Platform promo cost</span>
        </div>
      </div>
      <div className="admin-finance-costs" role="img" aria-label={`Refund and promotion costs for ${period}`}>
        <div className="admin-finance-costs__chart">
          <div className="admin-finance-costs__axis" aria-hidden="true">
            {guideRatios.map((ratio) => (
              <span key={ratio}>
                {formatWholeMoney(Math.round(axisMax * multiplier * ratio))}
              </span>
            ))}
          </div>
          <div className="admin-finance-costs__plot">
            <div className="admin-finance-costs__guides" aria-hidden="true">
              {guideRatios.map((ratio) => <span key={ratio} />)}
            </div>
            {points.map((point) => (
              <div className="admin-finance-costs__week" key={point.label}>
                <div className="admin-finance-costs__bars">
                  <span
                    className="is-refund"
                    style={{ height: `${Math.max(10, (point.refunds / axisMax) * 100)}%` }}
                    title={`${point.label} refunds: ${formatWholeMoney(Math.round(point.refunds * multiplier))}`}
                  />
                  <span
                    className="is-promo"
                    style={{ height: `${Math.max(10, (point.platformPromoCost / axisMax) * 100)}%` }}
                    title={`${point.label} promo cost: ${formatWholeMoney(Math.round(point.platformPromoCost * multiplier))}`}
                  />
                </div>
                <small>{point.label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminCard>
  );
}

function MoneyFlowCard({ period }) {
  const moneyFlow = financeOverviewData.moneyFlow;
  const estimatedAfterPromo = calculateEstimatedPlatformRevenue({
    estimatedPlatformFees: moneyFlow.estimatedPlatformFees,
    platformPromoCost: moneyFlow.platformPromoCost,
  });

  return (
    <AdminCard className="admin-finance-overview-card admin-finance-overview-card--money-flow">
      <SectionHeader title="Platform Money Flow" />
      <div className="admin-finance-money-flow">
        <div className="admin-finance-money-flow__group admin-finance-money-flow__group--standalone">
          <div className="admin-finance-money-flow__row admin-finance-money-flow__row--positive">
            <div>
              <strong>Gross revenue</strong>
              <span>Paid order value</span>
            </div>
            <b>+{formatWholeMoney(scaleFinanceValue(moneyFlow.grossRevenue, period))}</b>
          </div>
        </div>

        <div className="admin-finance-money-flow__group">
          <span className="admin-finance-money-flow__group-title">Platform side</span>
          <div className="admin-finance-money-flow__row admin-finance-money-flow__row--positive">
            <div>
              <strong>Estimated platform fees</strong>
              <span>Estimated platform share</span>
            </div>
            <b>+{formatWholeMoney(scaleFinanceValue(moneyFlow.estimatedPlatformFees, period))}</b>
          </div>
          <div className="admin-finance-money-flow__row admin-finance-money-flow__row--cost">
            <div>
              <strong>Platform promo cost</strong>
              <span>Platform-funded discounts</span>
            </div>
            <b>-{formatWholeMoney(scaleFinanceValue(moneyFlow.platformPromoCost, period))}</b>
          </div>
          <div className="admin-finance-money-flow__row admin-finance-money-flow__row--result">
            <div>
              <strong>Net platform revenue</strong>
              <span>Fees minus platform promo cost</span>
            </div>
            <b>{formatWholeMoney(scaleFinanceValue(estimatedAfterPromo, period))}</b>
          </div>
        </div>

        <div className="admin-finance-money-flow__group">
          <span className="admin-finance-money-flow__group-title">
            Partner / customer obligations
          </span>
          <div className="admin-finance-money-flow__row">
            <div>
              <strong>Restaurant payouts</strong>
              <span>Owed to partners</span>
            </div>
            <b>{formatWholeMoney(scaleFinanceValue(moneyFlow.restaurantPayouts, period))}</b>
          </div>
          <div className="admin-finance-money-flow__row">
            <div>
              <strong>Refunds</strong>
              <span>Returned to customers</span>
            </div>
            <b>{formatWholeMoney(scaleFinanceValue(moneyFlow.refunds, period))}</b>
          </div>
        </div>
      </div>
    </AdminCard>
  );
}

function AttentionShortcuts({ onShortcut }) {
  return (
    <AdminCard className="admin-finance-overview-card admin-finance-overview-card--attention">
      <SectionHeader title="Attention Needed" />
      <div className="admin-finance-attention">
        {financeOverviewData.attentionItems.map((item) => (
          <button
            key={item.label}
            type="button"
            className="admin-finance-attention__item"
            onClick={() => onShortcut(item.shortcutKey)}
          >
            <span className="admin-finance-attention__heading">
              <strong>{item.label}</strong>
              <b>{item.value}</b>
            </span>
            <span className="admin-finance-attention__description">{item.description}</span>
            <span className="admin-finance-attention__footer">
              <em>{item.urgency}</em>
              <u>{item.actionLabel}</u>
            </span>
          </button>
        ))}
      </div>
    </AdminCard>
  );
}

function TopRestaurantsBars() {
  const topRestaurants = financeOverviewData.topRestaurants;
  const maxGross = Math.max(...topRestaurants.map((restaurant) => restaurant.gross));

  return (
    <AdminCard className="admin-finance-overview-card admin-finance-overview-card--restaurants">
      <SectionHeader title="Top Earning Restaurants" />
      <div className="admin-finance-list admin-finance-list--bars">
        {topRestaurants.map((restaurant, index) => (
          <div key={restaurant.name} className="admin-finance-list__row">
            <div className="admin-finance-list__row-top">
              <span className="admin-finance-list__rank">{index + 1}</span>
              <div>
                <strong>{restaurant.name}</strong>
                <span>
                  {formatWholeMoney(restaurant.gross)} gross &bull;{" "}
                  {formatWholeMoney(restaurant.platformFee)} platform fee
                </span>
              </div>
              <em className={restaurant.change >= 0 ? "is-positive" : "is-negative"}>
                {restaurant.change >= 0 ? "+" : ""}{restaurant.change}%
              </em>
            </div>
            <div
              className="admin-finance-restaurant-progress"
              role="progressbar"
              aria-label={`${restaurant.name}: ${restaurant.share}% of total gross revenue`}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={restaurant.share}
            >
              <div
                className="admin-finance-restaurant-progress__bar"
                style={{ width: `${(restaurant.gross / maxGross) * 100}%` }}
              />
            </div>
            <small>{restaurant.share}% of total revenue</small>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

function PromotionRefundImpact({ period }) {
  const impact = financeOverviewData.promotionImpact;

  return (
    <AdminCard className="admin-finance-overview-card admin-finance-overview-card--impact">
      <SectionHeader title="Promotion & Refund Impact" />
      <div className="admin-finance-impact">
        <div className="admin-finance-impact__section">
          <span>Promotions</span>
          <strong>{scaleFinanceValue(impact.redemptionsToday, period)} redemptions</strong>
          <p>{formatWholeMoney(scaleFinanceValue(impact.platformPromoCost, period))} platform cost</p>
          <p>Top promo: {impact.topPromo}</p>
        </div>
        <div className="admin-finance-impact__section">
          <span>Refunds</span>
          <strong>{formatWholeMoney(scaleFinanceValue(impact.refundsToday, period))} returned</strong>
          <p>{impact.pendingRefunds} pending refunds</p>
          <p>Top reason: {impact.topRefundReason}</p>
        </div>
        <div className="admin-finance-impact__total">
          <span>Total financial impact</span>
          <strong>
            -{formatWholeMoney(
              scaleFinanceValue(
                impact.platformPromoCost + impact.refundsToday,
                period,
              ),
            )}
          </strong>
          <p>{impact.previousPeriodChange}% higher cost than previous period</p>
        </div>
      </div>
    </AdminCard>
  );
}

export function FinanceOverview({ onShortcut, period }) {
  return (
    <div className="admin-finance-overview">
      <FinanceTrendChart period={period} />
      <CostsAdjustmentsChart period={period} />
      <MoneyFlowCard period={period} />
      <AttentionShortcuts onShortcut={onShortcut} />
      <TopRestaurantsBars />
      <PromotionRefundImpact period={period} />
    </div>
  );
}
