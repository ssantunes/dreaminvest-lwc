import { LightningElement, api, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { fireEvent } from 'c/pubsub';
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import NO_UI_SLIDER from '@salesforce/resourceUrl/nouislider';

export default class InvestimentProfileReturn extends LightningElement {
    @api filterName;
    @api label;
    @api min = '1';
    @api max = '3';
    @api step = '1';

    @wire(CurrentPageReference) pageRef;

    _isRendered;

    renderedCallback() {
        
        if (this._isRendered) return;
        this._isRendered = true;
        Promise.all([
            loadStyle(this, NO_UI_SLIDER + '/nouislider.css'),
            loadScript(this, NO_UI_SLIDER + '/nouislider.js')
        ]).then(() => {
            const slider = this.template.querySelector('.slider');
            var InvestmentProfiles = ['','Conservador','Moderado','Arrojado']
            window.noUiSlider.create(slider, {
                start: [this.min],
                connect: false,
                tooltips: true,
                cssPrefix: 'noUi-',
                step: Number.parseInt(this.step, 10),
                format: {
                    to(value) {
                        return InvestmentProfiles[value];
                        //return Math.round(value);
                    },
                    from(value) {
                        return value;
                    }
                },
                range: {
                    min: Number.parseInt(this.min, 10),
                    max: Number.parseInt(this.max, 10)
                }
            });
            
            var tooltipValue = document.getElementsByClassName("noUi-tooltip")[0];
            var cor = 'Conservador';
            slider.noUiSlider.on('update', (range) => {
                tooltipValue.classList.remove(cor);
                cor=range[0];
                tooltipValue.classList.add(cor);
            });

            slider.noUiSlider.on('change', (range) => {
                fireEvent(this.pageRef, 'dreaminvest__investmentprofilechange', {
                    filterName: this.filterName,
                    Value: InvestmentProfiles.indexOf(range[0])
                });
            });
        });
    }
}
