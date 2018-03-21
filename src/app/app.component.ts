import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  config = {
    "panes": [
      {
        "title": "Pane A",
        "widgets": [
          {
            "title": "Device 1",
            "component": {
              "type": "KENDO_RADIAL_GAUGE",
              "dataSrc": "events/latest",
              "inputs": [
                { "from": "parent.child", "to": "pointer.value", "value": 0, },
                { "from": "parent2.child.child2.value", "to": "scale.max", "value": 100,  },
                { "to": "input1", "value": 100 }
              ]
            }
          }
        ]
      }
    ],
    "datasources": [
      {
        "name": "events/latest",
        "options": {
          "url": "https://jsonplaceholder.typicode.com/posts",
          "refresh": 5,
          "type": "GET"
        }
      }
    ]
  }

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit() {
    this.config.panes.forEach((pane) => {
      pane.widgets.forEach((widget) => {
        let inputs = widget.component.inputs;
        let dataSource = this.config.datasources.find(ds => ds.name == widget.component.dataSrc);

        if (dataSource.options.type === "GET") {
          let url = dataSource.options.url;
          let data = this.getEvents();

          inputs.forEach((input) => {
            let newValue = this.deepValue(data, input["from"]);

            if (newValue) {
              input.value = newValue;
            }
          });
        }
      });
    });
  }

  getEvents() {
    return {
      parent: {
        child: 50
      },
      parent2: {
        child: {
          child2: {
            value: 100
          }
        }
      }
    }
  }

  deepValue(obj, path) {
    try {
      for (var i = 0, path = path.split('.'), len = path.length; i < len; i++) {
        obj = obj[path[i]];
      };
      return obj;
    } catch (err) {
    }
  }

}
